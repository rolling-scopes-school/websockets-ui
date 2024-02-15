import { User } from "../service/client/types";
import WebSocket from "ws";

export class Storage {
  private players: Map<number, User>;
  private playersNames: Map<string, number>;
  clients: Map<number, WebSocket>;
  private rooms: Map<string, string>;
  private winners: Map<string, number>;
  constructor() {
    this.players = new Map<number, User>();
    this.playersNames = new Map<string, number>();
    this.clients = new Map<number, WebSocket>();
  }

  addClient(ws: WebSocket) {
    const id = this.getIndex(this.clients);
    this.clients.set(id, ws);
    return id;
  }

  removeClient(id: number) {
    this.clients.delete(id);
  }

  addPlayer(data: User) {
    const index = this.getIndex(this.players);
    this.players.set(index, data);
    this.playersNames.set(data.name, index);
    return { ...data, index };
  }

  getUser(where: { name?: string; index?: number }) {
    const { name, index } = where;
    if (index) {
      return { ...this.players.get(index), index };
    }
    if (name) {
      const index = this.playersNames.get(name);
      return { ...this.players.get(index), index };
    }
  }

  getIndex(model: Map<any, any>) {
    const index = Math.floor(1 + Math.random() * 10000);
    if (model.has(index)) {
      this.getIndex(model);
    }
    return index;
  }
}
