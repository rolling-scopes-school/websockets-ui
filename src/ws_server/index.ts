import WebSocket from "ws";
import { ClientService } from "./service/client.service";
import { DB } from "./db/storage";


export class WsServer {
  private server: WebSocket.Server;
  private clientMessagesService: ClientService;
  private storage: DB;
  constructor(port: number) {
    this.storage = new DB();
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
    new ClientService(ws, this.storage);
  }

  private closeAllConnections() {
    this.server.clients.forEach((client) => {
      client.close();
    });
  }
}
