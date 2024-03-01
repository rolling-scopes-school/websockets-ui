import { Ship } from './ClientData';

export interface ServerRegData {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface ServerUpdateWinnersDataItem {
  name: string;
  wins: number;
}

export interface ServerCreateGameData {
  idGame: number;
  idPlayer: number;
}

export interface ServerUpdateRoomDataItem {
  roomId: string;
  roomUsers: {
    name: string;
    index: number;
  }[];
}

export interface ServerStartGameData {
  ships: Ship[];
  currentPlayerIndex: number;
}

export interface ServerAttackData {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
}

export interface ServerTurnData {
  currentPlayer: number;
}

export interface ServerFinishData {
  winPlayer: number;
}

export type ServerData =
  | ServerRegData
  | ServerUpdateWinnersDataItem[]
  | ServerCreateGameData
  | ServerUpdateRoomDataItem[]
  | ServerStartGameData
  | ServerAttackData
  | ServerTurnData
  | ServerFinishData;
