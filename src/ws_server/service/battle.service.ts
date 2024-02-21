import { DB } from "../db/storage";
import { AddShipsData, AttackData } from "../types";
import { getIndex } from "../db/helpers";

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
    console.log(game.index);
    console.log(game.users);
    const gameUsers = game.users;
    console.log(`Game: ${gameId} - User ${indexPlayer} add ships`);
    if (
      gameUsers.every(
        (user) => user.ships !== undefined && user.ships.length === 10
      )
    ) {
      game.next = indexPlayer;
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

  attack(data: AttackData) {
    const { gameId, x, y, indexPlayer } = data;

    const game = this.storage.games.get(gameId);
    if (game.next !== indexPlayer) {
      return `Attack failed it's the player's turn ${game.next}`;
    }
    const user = game.users.find((user) => user.index === indexPlayer);
    const opponent = game.users.find((user) => user.index !== indexPlayer);
    if (user.pastAttacks.has({ x, y })) {
      return `User already shat to x: ${x} y ${y}`;
    }
    user.pastAttacks.add({ x, y });
    const ships = opponent.ships;
    const target = ships[y][x];
    if (target == 0) {
      return "miss";
    }
    if (target == 1) {
      ships[y][x] = 2;
      if (this.isShipAlive(ships, x, y)) {
        return "попал";
      }
      return "ГОТОВ";
    }
  }

  isShipAlive(ships: number[][], x: number, y: number): boolean {
    const maxY = ships.length;
    const maxX = ships[0].length;

    // Проверяем соседнюю ячейку сверху
    if (y > 0 && ships[y - 1][x] === 1) {
      return true; // Найдена живая часть корабля
    }

    // Проверяем соседнюю ячейку снизу
    if (y < maxY - 1 && ships[y + 1][x] === 1) {
      return true; // Найдена живая часть корабля
    }

    // Проверяем соседнюю ячейку слева
    if (x > 0 && ships[y][x - 1] === 1) {
      return true; // Найдена живая часть корабля
    }

    // Проверяем соседнюю ячейку справа
    if (x < maxX - 1 && ships[y][x + 1] === 1) {
      return true; // Найдена живая часть корабля
    }

    return false; // Корабль убит
  }
}
