import WebSocket from "ws";

export class User {
  name: string;
  password: string;
  index: number;
  ws: WebSocket;
  gameIndex?: number;
  ships?: number[][];
  constructor(args: {
    name: string;
    password: string;
    ws: WebSocket;
    index: number;
  }) {
    const { ws, index, name, password } = args;
    this.name = name;
    this.password = password;
    this.index = index;
    this.ws = ws;
  }
  pastAttacks = new Set<string>();
  shipsKill = 0;
}

export class Game {
  index: number;
  users: User[] = [];
  next: number;
  constructor(args: { index: number; user: User }) {
    const { user, index } = args;
    this.index = index;
    this.users.push(user);
    user.gameIndex = index;
  }
}
