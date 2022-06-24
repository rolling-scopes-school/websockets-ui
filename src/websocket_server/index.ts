import { WebSocketServer } from 'ws';
import redirectToFuntion from '../redirectFuntion';

export default function startWebSocketServer(): void {
  const wsServer: WebSocketServer = new WebSocketServer({
    port: 8080,
  });
  wsServer.on('connection', (ws) => {
    ws.on('message', (message: string) => {
      const command: string[] = message.toString().split(' ');
      redirectToFuntion(command, ws);
    });
  });
  wsServer.on('close', () => {
    // eslint-disable-next-line no-console
    console.log('exit server');
  });
}
