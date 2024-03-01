import { GamePlayer } from './types/Player';
import { GameRoom } from './types/Room';

export class Room implements GameRoom {
  id: string;
  players: GamePlayer[] = [];

  constructor(id: string | number) {
    this.id = String(id);
  }

  addPlayer(player: GamePlayer): void {
    this.players.push(player);
  }
}
