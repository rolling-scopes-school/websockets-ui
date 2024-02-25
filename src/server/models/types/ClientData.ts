export interface ClientRegData {
  name: string;
  password: string;
}

export interface ClientCreateRoomData {
  data: string;
}

export interface ClientAddUserToRoomData {
  indexRoom: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Ship {
  position: Coordinates;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface ClientAddShipsData {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface ClientAttackData extends Coordinates {
  gameId: number;
  indexPlayer: number;
}

export interface ClientRandomAttack {
  gameId: number;
  indexPlayer: number;
}

export type ClientData =
  | ClientRegData
  | ClientCreateRoomData
  | ClientAddUserToRoomData
  | ClientAddShipsData
  | ClientAttackData
  | ClientRandomAttack;
