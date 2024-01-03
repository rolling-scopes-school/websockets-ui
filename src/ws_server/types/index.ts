import WebSocket from "ws";

export enum WebSocketCommand {
  Register = 'reg',
  UpdateWinners = 'update_winners',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CreateGame = 'create_game',
  UpdateRoom = 'update_room',
  AddShips = 'add_ships',
  StartGame = 'start_game',
  Attack = 'attack',
  RandomAttack = 'randomAttack',
  Turn = 'turn',
  Finish = 'finish',
}

export interface CustomWebSocket extends WebSocket {
  userId: number;
  userRoomId: number;
}

export interface WebSocketMessage {
  type: WebSocketCommand;
  data: string;
  id: number;
}

export type Client = {
  [key: number]: CustomWebSocket | undefined;
};

export interface User {
  index: number;
  name: string;
  password?: string;
  error?: boolean;
  errorText?: string;
}

export interface Room {
  roomId: number;
  roomUsers: User[];
}

export interface Game {
  gameId: number;
  room: Room;
}

enum ShipSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  Huge = "huge"
}

export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  position: Position,
  direction: boolean,
  length: number,
  type: ShipSize
}
