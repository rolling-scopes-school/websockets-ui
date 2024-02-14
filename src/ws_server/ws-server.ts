import WebSocket from "ws";
import { ClientService } from "./service/client-service/client-service";

export class WsServer {
  private server: WebSocket.Server;
  private clientMessagesService: ClientService;
  constructor(port: number) {
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
    new ClientService(ws);
  }

  private closeAllConnections() {
    this.server.clients.forEach((client) => {
      client.close();
    });
  }
}
