import { RoomData, User } from "../service/client/types";
import WebSocket from "ws";

export class Storage {
  private users: Map<number, User>;
  private usersNames: Map<string, number>;
  clients: Map<number, WebSocket>;
  private rooms = new Map<number, { name: string; index: number }[]>();
  private winners: Map<string, number>;
  constructor() {
    this.users = new Map<number, User>();
    this.usersNames = new Map<string, number>();
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

  addUser(data: User) {
    const index = this.getIndex(this.users);
    this.users.set(index, data);
    this.usersNames.set(data.name, index);
    return { ...data, index };
  }

  getUser(where: { name?: string; index?: number }) {
    const { name, index } = where;
    if (index) {
      return { ...this.users.get(index), index };
    }
    if (name) {
      const index = this.usersNames.get(name);
      return { ...this.users.get(index), index };
    }
  }

  getIndex(model: Map<any, any>) {
    const index = Math.floor(1 + Math.random() * 10000);
    if (model.has(index)) {
      this.getIndex(model);
    }
    return index;
  }

  createRoom(userIndex: number) {
    const indexRoom = this.getIndex(this.rooms);
    const user = this.getUser({ index: userIndex });
    if (user.room) {
      return;
    }
    this.rooms.set(indexRoom, [{ name: user.name, index: userIndex }]);
    const roomsData: RoomData[] = [];
    this.rooms.forEach((roomUsers, roomId) => {
      if (roomUsers.length == 1) {
        roomsData.push({ roomId, roomUsers });
      }
    });
    this.users.get(userIndex).room = indexRoom;
    return roomsData;
  }
}
