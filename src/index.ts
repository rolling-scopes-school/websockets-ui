import { WebSocketServer } from 'ws';
import { httpServer } from './http_server/index.js';
import { wsHandler } from './server/ws.js';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  wsHandler(wss, ws);
})