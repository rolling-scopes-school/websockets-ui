import Jimp from 'jimp';
import {httpServer} from './src/http_server/index';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

import { messageHandler } from './src/messageHandler';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: 8080,
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
