import { WebSocketServer } from 'ws';
import { WebSocketStateClient } from '../interfaces';

export class CreateHandlers {
  public wsClient: WebSocketStateClient;
  public wsServer: WebSocketServer;

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  public clientConnection(wsClient: WebSocketStateClient): void {
    this.wsClient = wsClient;
    wsClient.on('error', console.error);

    wsClient.on('message', console.error);
    wsClient.on('close', console.error);
  }
}
