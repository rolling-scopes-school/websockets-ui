import { RawData } from "ws";
import { MessageType, User } from "./types";
import WebSocket from "ws";
import { Storage } from "src/ws_server/DB";
import { PlayerService } from "../player/player.service";
import { RoomService } from "../room/room.service";
export class ClientService {
  private client: WebSocket;
  private id: number;
  private userIndex: number;
  private storage: Storage;
  private playerService: PlayerService;
  private roomService: RoomService;
  constructor(client: WebSocket, id: number, storage: Storage) {
    this.storage = storage;
    this.id = id;
    this.client = client;
    this.playerService = new PlayerService(this.storage);
    this.roomService = new RoomService(this.storage);
    this.clientListener();
  }

  private clientListener() {
    this.client.on("message", (message) =>
      this.handleMessage(message, this.id)
    );
    this.client.on("close", () => this.close());
  }

  private close() {
    this.storage.removeClient(this.id);
    console.log(`Client ${this.id} connection closed`);
  }

  private handleMessage(message: RawData, id: number) {
    const parsedMessage = this.getParseMessage(message);
    const { type, data } = parsedMessage;
    console.log(`Command: ${JSON.stringify(parsedMessage)}`);
    let responseData;
    let result;
    switch (type) {
      case "error":
        responseData = data;
        result = JSON.stringify({
          type,
          data: JSON.stringify(responseData),
          id: 0,
        });
        this.client.send(result);
        break;
      case "reg":
        responseData = this.playerService.logIn(data);
        this.userIndex = responseData.error ? null : responseData.index;
        result = JSON.stringify({
          type,
          data: JSON.stringify(responseData),
          id: 0,
        });
        this.client.send(result);
        break;
      case "create_room":
        result = this.roomService.createRoom(this.userIndex);
        break;
    }

    console.log(`Result: ${result}`);
  }

  private getParseMessage(message: RawData): MessageType<any> {
    try {
      const parsedMessage = JSON.parse(message.toString());
      if (parsedMessage.data === "") {
        return { ...parsedMessage, data: "" };
      }
      return { ...parsedMessage, data: JSON.parse(parsedMessage.data) };
    } catch (e) {
      return {
        type: "error",
        data: { errorText: e.message, error: true },
        id: 0,
      };
    }
  }
}
