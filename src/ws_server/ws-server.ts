import WebSocket from "ws";

export class WsServer {
  private server: WebSocket.Server;
  constructor() {}

  start(port: number) {
    this.server = new WebSocket.Server({ port });
    console.log("WS server started at port " + port);
  }

  close() {}
}
