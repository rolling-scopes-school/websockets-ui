import {httpServer} from './src/http_server/index';
import { WebSocketServer } from 'ws';
import { messageHandler } from './src/messageHandler';

const HTTP_PORT = 3000;
const WS_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: WS_PORT
});

wss.on('connection', (instant) => {
  instant.on('message', (data) => {
    messageHandler(data, instant);
  });
});

wss.on('close', () => {
  console.log('close');
});

httpServer.on('close', () => {
  wss.close();
})
