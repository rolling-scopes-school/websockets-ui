import { DB } from "../db/storage";
import { AddShipsData } from "../types";

export class BattleService {
  storage: DB;
  constructor(storage: DB) {
    this.storage = storage;
  }

  addShips(data: AddShipsData) {
    const { gameId, ships, indexPlayer } = data;

    const userShips: number[][] = Array.from({ length: 10 }, () =>
      Array(10).fill(0)
    );
    ships.forEach((ship) => {
      const { x, y } = ship.position;

      if (ship.direction) {
        for (let i = y; i < y + ship.length; i++) {
          userShips[i][x] = 1;
        }
      } else {
        for (let j = x; j < x + ship.length; j++) {
          userShips[y][j] = 1;
        }
      }
    });
    const user = this.storage.users.get(indexPlayer);
    user.ships = userShips;
    const game = this.storage.games.get(gameId);
    const gameUsers = game.users;
    console.log(`Game:${gameId} - User ${indexPlayer}`);
    if (
      gameUsers.every(
        (user) => user.ships !== undefined && user.ships.length === 10
      )
    ) {
      gameUsers.forEach((gUser) => {
        gUser.ws.send(
          JSON.stringify({
            type: "start_game",
            data: JSON.stringify({ ships, currentPlayerIndex: indexPlayer }),
            id: 0,
          })
        );
      });
    }

    return userShips;
  }
}
