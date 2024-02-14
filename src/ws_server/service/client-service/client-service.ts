import { RawData } from "ws";
import { MessageType, User } from "./types";
import WebSocket from "ws";
export class ClientService {
  private client: WebSocket;
  constructor(client: WebSocket) {
    this.client = client;
    this.clientListener();
  }

  private clientListener() {
    this.client.on("message", (message) => this.handleMessage(message));
    this.client.on("close", () => this.close());
  }

  private close() {
    console.log("close");
  }

  private handleMessage(message: RawData) {
    const { type, data } = this.getParseMessage(message);
    switch (type) {
      case "error":
        this.client.send(JSON.stringify({ type, data }));
        break;
      case "reg":
        this.client.send(JSON.stringify(data));
        break;
    }
  }

  private getParseMessage(message: RawData): MessageType<any> {
    try {
      return JSON.parse(message.toString());
    } catch (e) {
      return { type: "error", data: { message: e.message }, id: 0 };
    }
  }
}
