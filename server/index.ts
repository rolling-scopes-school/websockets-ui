import { WebSocketServer, WebSocket } from 'ws';

const wws: WebSocket = new WebSocketServer({
  port: 8080,
});

wws.on('connection', (ws) => {
  ws.on('message', (data: Buffer) => {
    if (Buffer.isBuffer(data)) {
      console.log(data.toString());
    }
  });
});

wws.on('close', () => {
  console.log('close');
});
