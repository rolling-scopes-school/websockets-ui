import { WebSocket } from 'ws';
import { Ship } from './ClientData';
import { GameGrid } from './Game';

export interface PlayerLoginData {
  name: string;
  password: string;
}

export interface GamePlayer extends PlayerLoginData {
  id: string;
  index: number;
  wins: number;
  ws: WebSocket;
  ships: Ship[] | null;
  grid: GameGrid | null;
  points: number;
}
