import { WebSocketServer, WebSocket } from "ws";
import {
  GetAponent,
  deleteRoom,
  gameCanStart,
  getNextPlayer,
  getRoomByUser,
} from "./room.js";
import {
  addUser,
  checkUser,
  getUser,
  isUserExist,
  userWin,
  getWinners,
} from "./users.js";
import {
  addRoomUser,
  createRoom,
  getAvailableRooms,
  getRoom,
  getRoomUser,
} from "./room.js";
import { isHit, isShipKilled, isShot, getHitsAroundShip } from "./game.js";

const WS_PORT = 3000;

const formatResponse = (type, data, id = 0) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id,
  });
};

const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const updateRooms = () => {
  const availableRooms = getAvailableRooms();
  const response = formatResponse("update_room", availableRooms);
  broadcast(response);
};

const updateWinners = () => {
  const winners = getWinners();
  const response = formatResponse("update_winners", winners);
  broadcast(response);
};

const createGame = (room) => {
  wss.clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      room.roomUsers.some((roomUser) => roomUser.index === client.user?.index)
    ) {
      client.send(
        formatResponse("create_game", {
          idGame: room.roomId,
          idPlayer: client.user.index,
        })
      );
    }
  });
};

const attack = (gameId, indexPlayer, x, y) => {
  const room = getRoom(gameId);
  const currentPlayer = getRoomUser(gameId, room.currentPlayerIndex);

  if (!currentPlayer || currentPlayer.index !== indexPlayer) return;

  const nextPlayer = getNextPlayer(gameId);

  if (!nextPlayer) {
    console.error("Next player not found");
    return;
  }

  const doubleHit = isHit(nextPlayer, x, y);

  if (doubleHit) {
    console.log("Double hit");
    return;
  }

  nextPlayer.hits.push({ x, y });

  const shotShip = isShot(nextPlayer, x, y);

  let status = "miss";

  if (!shotShip) {
    room.currentPlayerIndex = nextPlayer.index;
  } else {
    status = isShipKilled(nextPlayer, shotShip) ? "killed" : "shot";
  }

  const hitsAround =
    status === "killed" ? getHitsAroundShip(nextPlayer, shotShip) : [];
  nextPlayer.hits = nextPlayer.hits.concat(hitsAround);

  const isGameOver = nextPlayer.ships.every((ship) => {
    return isShipKilled(nextPlayer, ship);
  });

  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;
    const player = room.roomUsers.find(
      (roomUser) => roomUser.index === client.user?.index
    );

    if (!player) return;

    const response = {
      position: { x, y },
      status: status,
      currentPlayer: currentPlayer.index,
    };

    client.send(formatResponse("attack", response));

    hitsAround.forEach((hit) => {
      const response = {
        position: { x: hit.x, y: hit.y },
        status: "miss",
        currentPlayer: currentPlayer.index,
      };
      client.send(formatResponse("attack", response));
    });

    if (isGameOver) {
      client.send(formatResponse("finish", { winPlayer: currentPlayer.index }));
    } else {
      client.send(
        formatResponse("turn", { currentPlayer: room.currentPlayerIndex })
      );
    }
  });

  if (isGameOver) {
    const winner = getRoomUser(room.roomId, currentPlayer.index);
    userWin(winner.name);
    updateWinners();
    deleteRoom(room.roomId);
  }
};

console.log(`Start WebSocket server on the ${WS_PORT} port!`);
const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("close", function close() {
    if (this.user) {
      const room = getRoomByUser(this.user.index);
      if (!room) return;
      const aponent = GetAponent(room.roomId, this.user.index);
      if (aponent) {
        userWin(aponent.name);
        updateWinners();
        broadcast(formatResponse("finish", { winPlayer: aponent.index }));
      }
      deleteRoom(room.roomId);
      updateRooms();
    }
  });

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data);
    const payload = parsedData.data === "" ? "" : JSON.parse(parsedData.data);

    // REGISTRATION AND AUTHORIZATION
    if (parsedData.type === "reg") {
      if (isUserExist(payload.name)) {
        if (checkUser(payload.name, payload.password)) {
          const user = getUser(payload.name);
          this.user = user;
          const response = {
            name: user.name,
            index: user.index,
            error: false,
          };
          ws.send(formatResponse("reg", response));
          updateRooms();
          updateWinners();
        } else {
          const response = {
            name: payload.name,
            error: true,
            errorText: "Wrong password",
          };
          ws.send(formatResponse("reg", response));
        }
      } else {
        const user = addUser(payload.name, payload.password);
        this.user = user;
        const response = { name: user.name, index: user.index, error: false };
        ws.send(formatResponse("reg", response));
        updateRooms();
        updateWinners();
      }

      // CREATE ROOM
    } else if (parsedData.type === "create_room") {
      const room = createRoom();
      addRoomUser(room.roomId, this.user);
      updateRooms();

      // ADD USER TO ROOM
    } else if (parsedData.type === "add_user_to_room") {
      const room = getRoom(payload.indexRoom);

      if (addRoomUser(room.roomId, this.user)) {
        updateRooms();
        createGame(room);
      }

      // RECEIVE SHIPS POSITIONS
    } else if (parsedData.type === "add_ships") {
      const room = getRoom(payload.gameId);
      const user = getRoomUser(payload.gameId, payload.indexPlayer);
      user.ships = payload.ships;

      if (gameCanStart(room)) {
        room.currentPlayerIndex = room.roomUsers[0].index;
        wss.clients.forEach((client) => {
          if (client.readyState !== WebSocket.OPEN) return;

          const player = getRoomUser(room.roomId, client.user?.index);
          if (!player) return;

          const response = {
            ships: player.ships,
            currentPlayerIndex: room.currentPlayerIndex,
          };
          client.send(formatResponse("start_game", response));
        });
      }

      // ATTACK
    } else if (parsedData.type === "attack") {
      const gameId = payload.gameId;
      const indexPlayer = payload.indexPlayer;
      const x = payload.x;
      const y = payload.y;
      attack(gameId, indexPlayer, x, y);

      // RANDOM ATTACK
    } else if (parsedData.type === "randomAttack") {
      const gameId = payload.gameId;
      const indexPlayer = payload.indexPlayer;
      const nextPlayer = getNextPlayer(gameId);
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      while (isHit(nextPlayer, x, y)) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
      attack(gameId, indexPlayer, x, y);
    }
  });
});
