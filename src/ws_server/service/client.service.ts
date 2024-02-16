import WebSocket, { RawData } from "ws";
import { DB } from "../db/storage";
import { UserService } from "./user.service";
import { GameService } from "./game.service";

export class ClientService {
  client: WebSocket;
  private userIndex: number;
  private storage: DB;
  private playerService: UserService;
  private gameService: GameService;
  constructor(client: WebSocket, storage: DB) {
    this.storage = storage;
    this.client = client;
    this.playerService = new UserService(this.storage);
    this.gameService = new GameService(this.storage);
    this.clientListener();
  }

  private clientListener() {
    this.client.on("message", (message) => this.handleMessage(message));
    this.client.on("close", () => this.close());
  }

  private close() {
    console.log(`Client ${this.userIndex} connection closed`);
  }

  private handleMessage(message: RawData) {
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
        responseData = this.playerService.logIn(data, this.client);
        this.userIndex = responseData.error ? null : responseData.index;
        result = JSON.stringify({
          type,
          data: JSON.stringify(responseData),
          id: 0,
        });
        this.client.send(result);
        break;
      case "create_room":
        result = this.gameService.createGame(this.userIndex);
        break;
      case "add_user_to_room":
        result = this.gameService.start(this.userIndex, data.indexRoom);
        break;
    }

    console.log(`Result: ${result}`);
  }

  private getParseMessage(message: RawData) {
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
