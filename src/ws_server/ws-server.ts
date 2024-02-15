import WebSocket from "ws";
import { ClientService } from "./service/client/client.service";
import { Storage } from "./DB/index";

export class WsServer {
  private server: WebSocket.Server;
  private clientMessagesService: ClientService;
  private storage: Storage;
  constructor(port: number) {
    this.storage = new Storage();
    this.server = new WebSocket.Server({ port });
    console.log(`WS server started at url ws://localhost:${port}/!`);
    this.setupListeners();
  }

  private setupListeners() {
    this.server.on("connection", (ws) => this.connectionListener(ws));
    this.server.on("close", () => {
      console.log("WebSocket server closed.");
      this.closeAllConnections();
    });
  }

  private connectionListener(ws: WebSocket) {
    const id = this.storage.addClient(ws);
    const client = new ClientService(ws, id, this.storage);
  }

  private closeAllConnections() {
    this.server.clients.forEach((client) => {
      client.close();
    });
  }
}
