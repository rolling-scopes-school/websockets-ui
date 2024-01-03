import { GamesDB } from "./db/gamesdb";
import { RoomsDB } from "./db/roomsdb";
import { UsersDB } from "./db/usersdb";
import { User, Client, WebSocketCommand, WebSocketMessage, CustomWebSocket, Room } from "./types";

interface WSSResponse {
  connection: CustomWebSocket;
  message: WebSocketMessage;
}

const clients: Client = {};
const usersDB = new UsersDB();
const roomsDB = new RoomsDB();
const gamesDB = new GamesDB();

export const handleWebSocketCommand = (message: WebSocketMessage, wsc: CustomWebSocket): WSSResponse[] => {
  let type: WebSocketCommand = message.type;
  const payload = message.data ? JSON.parse(message.data) : '';
  let data = '';

  const responses: WSSResponse[] = [];

  switch (message.type) {
    case WebSocketCommand.Register: {
      const newUser: User = usersDB.add(payload.name, payload.password);

      if (!newUser.error) {
        if (clients[newUser.index]) {
          newUser.error = true;
          newUser.errorText = 'User already connected';
        } else {
          wsc.userId = newUser.index;
          clients[newUser.index] = wsc;
        }
      }

      data = JSON.stringify(newUser);
      responses.push({ connection: wsc, message: { type, data, id: 0 } });
      break;
    }

    case WebSocketCommand.CreateRoom: {
      if (!wsc.userRoomId) {
        const currentUser = usersDB.getById(wsc.userId);
        const newRoom = roomsDB.create(currentUser.index, currentUser.name);
        wsc.userRoomId = newRoom.roomId;
      }

      const roomsSingle: Room[] = roomsDB.listRoomsSingleUser();
      type = WebSocketCommand.UpdateRoom;

      data = JSON.stringify(roomsSingle);
      Object.values(clients).forEach((connection) => {
        if (connection) {
          responses.push({ connection, message: { type, data, id: 0 } });
        }
      });

      break;
    }

    case WebSocketCommand.AddUserToRoom: {
      if (payload.indexRoom !== wsc.userRoomId) {
        const room = roomsDB.addToRoom(payload.indexRoom, wsc.userRoomId);
        wsc.userRoomId = payload.indexRoom;
        const newGame = gamesDB.create(room);
        const roomsSingle: Room[] = roomsDB.listRoomsSingleUser();

        Object.values(clients).forEach((connection) => {
          if (connection) {
            if (connection.userRoomId === payload.indexRoom) {
              type = WebSocketCommand.CreateGame;
              data = JSON.stringify({ idGame: newGame.index, idPlayer: connection.userId });
              responses.push({ connection, message: { type, data, id: 0 } });
            } else {
              type = WebSocketCommand.UpdateRoom;
              data = JSON.stringify(roomsSingle);
              responses.push({ connection, message: { type, data, id: 0 } });
            }
          }
        });
      }

      break;
    }

    case WebSocketCommand.AddShips: {
      gamesDB.addShips(payload.gameId, payload.indexPlayer, payload.ships);

      if (gamesDB.isBothShips(payload.gameId)) {
        const game = gamesDB.getGameById(payload.gameId);
        const users = game.room.roomUsers;

        users.forEach((user) => {
          type = WebSocketCommand.StartGame;
          data = JSON.stringify({
            ships: game[user.index],
            currentPlayerIndex: user.index,
          });

          const connection = clients[user.index];

          if (connection) {
            responses.push({
              connection: connection,
              message: { type, data, id: 0 },
            });
          }
        });
      }

      break;
    }
  }

  return responses;
};

export const controlWebSocketConnection = (wsc: CustomWebSocket) => {
  console.log('A client connected');

  wsc.on('open', () => {
    console.log('Opened');
  });

  wsc.on('message', (data) => {
    const messageIn: WebSocketMessage = JSON.parse(data.toString());
    console.log('Message from client', messageIn);
    const responses = handleWebSocketCommand(messageIn, wsc);

    responses.forEach((response) => {
      if (response.connection) {
        const messageOutTxt = JSON.stringify(response.message);
        response.connection.send(messageOutTxt);
        console.log('Message to Client', response.message);
      }
    });
  });

  wsc.on('close', () => {
    if (wsc.userId) {
      clients[wsc.userId] = undefined;
    }
  });

  wsc.on('error', console.error);
};
