import { WebSocketServer } from 'ws';

export default function startWebSocketServer(): void {
  const ws = new WebSocketServer({
    port: 8080,
  });

  ws.on('connection', () => {
    console.log('connection');
  });
  ws.on('messages', (message: string) => {
    console.log(message);
  });
  ws.on('close', () => {
    console.log('Exit');
  });
}
