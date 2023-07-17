import WebSocket from 'ws';
import { CONSTANTS_SHIP_TYPE } from './constants';

export interface WebSocketStateClient extends WebSocket {
  playerInfo: {
    name: string;
    index: string;
    roomId: string;
    idGame: string;
    ships: Ship[];
    startPosition: string;
    fieldShips: (number | CellState)[][];
    isSingleGame: boolean;
    botInfo: BotInfo;
  };
}

export interface BotInfo {
  name: string;
  index: string;
  idGame: string;
}

export interface CellState {
  type: ValueOf<typeof CONSTANTS_SHIP_TYPE>;
  length: number;
  health: number;
  shots: Position[];
  startPosition: Position;
  missAroundPosition: Position[];
  status: Status;
}
type Status = 'alive' | 'killed';

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ValueOf<typeof CONSTANTS_SHIP_TYPE>;
}

export interface Position {
  x: number;
  y: number;
}

export type ValueOf<T> = T[keyof T];
