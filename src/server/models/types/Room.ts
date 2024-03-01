import { GamePlayer } from './Player';

export interface GameRoom {
  id: string;
  players: GamePlayer[];
}
