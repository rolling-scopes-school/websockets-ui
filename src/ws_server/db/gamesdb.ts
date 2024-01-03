import { Room, Ship } from "../types"

const START_INDEX = 1;

type Game = {
    index:number,
    room:Room,
    [key:number]:Ship[] 
}
type dbGames = { [id: number]: Game };

export class GamesDB {
  private games: dbGames = {};
  private index: number = START_INDEX;

  create(forRoom: Room): Game {
    const newGame: Game = {index: this.index++, room: forRoom};
    this.games[newGame.index] = newGame;
    return newGame;
  }

  getGameById(gameId:number): Game {
    return this.games[gameId];
  }

  addShips(gameId: number, indexPlayer: number, ships:Ship[]) {
    const game = this.getGameById(gameId);
    game[indexPlayer] = ships;
  }

  isBothShips(gameId:number): boolean {
    const game = this.getGameById(gameId);
    return Object.keys(game).length === 4
  }
}