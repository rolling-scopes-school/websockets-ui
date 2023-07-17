import { WebSocketServer } from 'ws';
import { WebSocketStateClient } from './interfaces';
import { CreateHandlers } from './handler/crate-handlers';

export class CreateWebSocketServer {
  public wss: WebSocketServer;
  protected handlers: CreateHandlers;
  constructor(public port: number) {
    this.port = port;
    this.wss = new WebSocketServer({ port });

    this.createListener();
  }

  private createListener(): void {
    this.wss.on('connection', (wsClient: WebSocketStateClient) => {
      new CreateHandlers(this.wss).clientConnection(wsClient);
    });
    this.wss.on('close', this.serverClose);
  }

  public serverClose = (): void => {
    console.log('server closed');
  };
}
