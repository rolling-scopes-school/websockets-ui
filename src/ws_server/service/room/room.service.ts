import { Storage } from "src/ws_server/DB";
import WebSocket from "ws";

export class RoomService {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  createRoom(index: number) {
    const roomsData = this.storage.createRoom(index);
    if (roomsData) {
      this.storage.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "update_room",
              data: JSON.stringify(roomsData),
              id: 0,
            })
          );
        }
      });
      return "Room created successfully";
    }
    return "This player already created a room";
  }
}
