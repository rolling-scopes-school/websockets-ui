import { RawData } from "ws";
import { MessageType, User } from "./types";
import WebSocket from "ws";
import { Storage } from "src/ws_server/DB";
import { PlayerService } from "../player/player.service";
export class ClientService {
  private client: WebSocket;
  private id: number;
  private storage: Storage;
  private playerService: PlayerService;
  constructor(client: WebSocket, id: number, storage: Storage) {
    this.storage = storage;
    this.id = id;
    this.client = client;
    this.clientListener();
    this.playerService = new PlayerService(this.storage);
  }

  private clientListener() {
    this.client.on("message", (message) => this.handleMessage(message));
    this.client.on("close", () => this.close());
  }

  private close() {
    this.storage.removeClient(this.id);
    console.log("close");
  }

  private handleMessage(message: RawData) {
    const parsedMessage = this.getParseMessage(message);
    const { type, data } = parsedMessage;
    let responseData;
    switch (type) {
      case "error":
        responseData = data;
        break;
      case "reg":
        responseData = this.playerService.logIn(data);
        break;
    }

    const result = JSON.stringify({ type, data: responseData, id: 0 });

    console.log(`Command: ${JSON.stringify(parsedMessage)}`);
    console.log(`Result: ${result}`);

    this.client.send(result);
  }

  private getParseMessage(message: RawData): MessageType<any> {
    try {
      return JSON.parse(message.toString());
    } catch (e) {
      return {
        type: "error",
        data: { errorText: e.message, error: true },
        id: 0,
      };
    }
  }
}
