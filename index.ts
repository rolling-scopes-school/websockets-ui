import { httpServer } from './src/http_server/index';
import "dotenv/config";
import WebSocket, { WebSocketServer } from 'ws';
import { createStream } from './src/websocket/stream';

const HTTP_PORT = process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocket('ws://localhost:8080');
const wss = new WebSocketServer({ port: 8080 });

console.log(`Start websocket server on the ${wss.options.port} port!`);

wss.on('connection', (ws) => {
  createStream(ws);
});

wss.on('error', (error) => {
  console.log(error);
});

wss.on('close', () => {
  console.log('Server closed');
});

process.on('SIGINT', function () {
  console.log('\nWebsocket closed successfully');

  socket.close();

  process.exit();
});
