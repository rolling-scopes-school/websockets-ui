import { WebSocket } from 'ws';
import { GamePlayer, PlayerLoginData } from './types/Player';
import { Ship } from './types/ClientData';
import { GameGrid } from './types/Game';

export class Player implements GamePlayer {
  name: string;
  password: string;
  index: number;
  wins: number;
  ws: WebSocket;
  grid: GameGrid | null;
  points: number;
  ships: Ship[] | null;
  id: string;

  constructor(data: PlayerLoginData, index: number, ws: WebSocket, id: string) {
    this.name = data.name;
    this.password = data.password;
    this.index = index;
    this.wins = 0;
    this.ws = ws;
    this.grid = null;
    this.points = 0;
    this.ships = null;
    this.id = id;
  }
}
