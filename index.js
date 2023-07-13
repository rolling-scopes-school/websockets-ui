import { httpServer } from "./src/http_server/index.js";
import { WebSocketServer, WebSocket } from "ws";

const WS_PORT = 3000;
const HTTP_PORT = 8181;

const RESP_ROOMS = [
  {
    roomId: 1,
    roomUsers: [
      {
        name: "user1",
        index: 2,
      },
    ],
  },
];

const users = [];
const isUserExist = (name) => {
  return users.some((user) => user.name === name);
};
const addUser = (name, password) => {
  const index = users.length + 1;
  const user = { name, password, index };
  users.push(user);
  return user;
};
const getUser = (name) => {
  return users.find((user) => user.name === name);
};
const checkUser = (name, password) => {
  return users.some((user) => user.name === name && user.password === password);
};

const rooms = [];
const createRoom = () => {
  const roomId = rooms.length + 1;
  const roomUsers = [];
  const room = { roomId, roomUsers };
  rooms.push(room);
  return room;
};
const addRoomUser = (roomId, user) => {
  const room = rooms.find((room) => room.roomId === roomId);
  const roomUser = {
    name: user.name,
    index: user.index,
    ships: [],
    hits: [],
  };
  room.roomUsers.push(roomUser);
  return room;
};
const getAvailableRooms = () =>
  rooms.reduce((prev, curr) => {
    if (curr.roomUsers.length < 2) {
      const roomUsers = curr.roomUsers.map((user) => {
        return {
          name: user.name,
          index: user.index,
        };
      });
      prev.push({
        roomId: curr.roomId,
        roomUsers: roomUsers,
      });
    }
    return prev;
  }, []);

const broadcastRooms = () => {
  const availableRooms = getAvailableRooms();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "update_room",
          data: JSON.stringify(availableRooms),
          id: 0,
        })
      );
    }
  });
};

const createGame = (room) => {
  wss.clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      room.roomUsers.some((roomUser) => roomUser.index === client.user?.index)
    ) {
      client.send(
        JSON.stringify({
          type: "create_game",
          data: JSON.stringify({
            idGame: room.roomId,
            idPlayer: client.user.index,
          }),
          id: 0,
        })
      );
    }
  });
};

const updateWinners = () => {
  console.log("updateWinners");
};

const formatResponse = (type, data, id = 0) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id,
  });
};

console.log(`Start WebSocket server on the ${WS_PORT} port!`);
const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
    const parsedData = JSON.parse(data);

    const payload = parsedData.data === "" ? "" : JSON.parse(parsedData.data);
    console.log(payload);
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
          broadcastRooms();
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
        broadcastRooms();
        updateWinners();
      }
      // CREATE ROOM
    } else if (parsedData.type === "create_room") {
      console.log("create_room, user", this.user);
      const room = createRoom();
      addRoomUser(room.roomId, this.user);
      broadcastRooms();
      // ADD USER TO ROOM
    } else if (parsedData.type === "add_user_to_room") {
      const room = rooms.find((room) => room.roomId === payload.indexRoom);
      if (
        room.roomUsers.length < 2 &&
        !room.roomUsers.some((user) => user.index === this.user.index)
      ) {
        addRoomUser(room.roomId, this.user);
        broadcastRooms();
        createGame(room);
      }
      // RECEIVE SHIPS POSITIONS
    } else if (parsedData.type === "add_ships") {
      const room = rooms.find((room) => room.roomId === payload.gameId);
      const user = room.roomUsers.find(
        (user) => user.index === payload.indexPlayer
      );
      user.ships = payload.ships;

      if (room.roomUsers.every((user) => user.ships?.length > 0)) {
        room.currentPlayerIndex = room.roomUsers[0].index;
        wss.clients.forEach((client) => {
          if (client.readyState !== WebSocket.OPEN) return;
          const player = room.roomUsers.find(
            (roomUser) => roomUser.index === client.user?.index
          );
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
      const room = rooms.find((room) => room.roomId === payload.gameId);
      const currentPlayer = room.roomUsers.find(
        (user) => user.index === room.currentPlayerIndex
      );
      if (!currentPlayer || currentPlayer.index !== payload.indexPlayer) return;

      const nextPlayer = room.roomUsers.find(
        (user) => user.index !== room.currentPlayerIndex
      );
      console.log("Payload", payload);
      const shotShip = nextPlayer.ships.find((ship) => {
        console.log(ship);
        for (let i = 0; i < ship.length; i++) {
          if (ship.direction) {
            console.log(
              ship.position.x + i,
              payload.x,
              ship.position.y,
              payload.y
            );
            if (
              ship.position.x + i === payload.x &&
              ship.position.y === payload.y
            ) {
              return true;
            }
          } else {
            console.log(
              ship.position.x,
              payload.x,
              ship.position.y + i,
              payload.y
            );
            if (
              ship.position.x === payload.x &&
              ship.position.y + i === payload.y
            ) {
              return true;
            }
          }
        }
        return false;
      });

      let status = "miss";

      if (!shotShip) {
        room.currentPlayerIndex = nextPlayer.index;
      }

      if (shotShip) {
        status = "shot";
        //killed
      }

      const isGameOver = nextPlayer.ships.every((ship) => {
        return ship.status === "killed";
      });

      wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;
        const player = room.roomUsers.find(
          (roomUser) => roomUser.index === client.user?.index
        );
        if (!player) return;

        client.send(
          JSON.stringify({
            type: "attack",
            data: JSON.stringify({
              position: { x: payload.x, y: payload.y },
              status: status,
              currentPlayer: currentPlayer.index,
            }),
            id: 0,
          })
        );

        if (isGameOver) {
          client.send(
            JSON.stringify({
              type: "finish",
              data: JSON.stringify({
                winPlayer: currentPlayer.index,
              }),
              id: 0,
            })
          );
        } else {
          client.send(
            JSON.stringify({
              type: "turn",
              data: JSON.stringify({
                currentPlayer: room.currentPlayerIndex,
              }),
              id: 0,
            })
          );
        }
      });
      // RANDOM ATTACK
    } else if (parsedData.type === "randomAttack") {
    }
  });

  //   ws.send("connected");
});

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
