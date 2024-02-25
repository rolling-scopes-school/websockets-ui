import WebSocket from 'ws';
import { WS_COMMAND_TYPES } from './constants';

export interface IClientData {
  ws: WebSocket;
  wins: number;
  userName: string;
}

export interface IClients {
  [key: string]: IClientData;
}

export interface IRegData {
  type: 'reg';
  data: string;
  id: 0;
}

type TRoomUser = {
  name: string;
  index: string;
};

export interface IRoom {
  roomId: string;
  roomUsers: TRoomUser[];
}

export type TShip = {
  position: { x: number; y: number };
  direction: boolean;
  type: string;
  length: number;
};

export interface IPlayer {
  ships: TTarget[][];
  indexPlayer: string;
}

export interface IPlayers {
  player1: IPlayer;
  player2: IPlayer;
}

export interface IGame {
  [key: string]: IPlayers;
}

export type TTarget = {
  x: number;
  y: number;
  hit: boolean;
  direction: boolean;
};

export type TPosition = {
  x: number;
  y: number;
};

const obj = { ...Object.values(WS_COMMAND_TYPES) };

export type WsCommandKeys = keyof typeof obj;
