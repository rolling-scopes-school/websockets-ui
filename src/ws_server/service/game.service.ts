import { getIndex } from "../db/helpers";
import { Game } from "../db/models";
import { DB } from "../db/storage";
import WebSocket from "ws";



export class GameService {
  storage: DB;
  constructor(storage: DB) {
    this.storage = storage;
  }

  createGame(userIndex: number) {
    const user = this.storage.users.get(userIndex);
    if (user.gameIndex) {
      return "This player already created a room";
    }
    const gameIndex = getIndex(this.storage.games);
    const game = new Game({ index: gameIndex, user });
    this.storage.games.set(gameIndex, game);
    this.updateRooms();
    return "Room created successfully";
  }

  updateRooms() {
    const data: {
      roomId: number;
      roomUsers: { name: string; index: number }[];
    }[] = [];
    this.storage.games.forEach((game) => {
      if (game.users.length == 1) {
        const { name, index } = game.users[0];
        data.push({
          roomId: game.index,
          roomUsers: [{ name, index }],
        });
      }
    });
    this.storage.users.forEach(({ ws }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "update_room",
            data: JSON.stringify(data),
            id: 0,
          })
        );
      }
    });
  }

  start(userIndex: number, indexRoom: number) {
    const newUser = this.storage.users.get(userIndex);
    const game = this.storage.games.get(indexRoom);
    game.users.push(newUser);
    game.users.forEach((user) => {
      user.ws.send(
        JSON.stringify({
          type: "create_game",
          data: JSON.stringify({ idGame: indexRoom, idPlayer: userIndex }),
          id: 0,
        })
      );
    });
    this.updateRooms();
    return `Game ${indexRoom} started`;
  }
}
