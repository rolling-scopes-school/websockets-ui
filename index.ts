import {httpServer} from './src/http_server/index';
import { WebSocketServer } from 'ws';
import onSocketConnection from './src/onSocketConnection';

const HTTP_PORT = 3000;
const WS_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: WS_PORT
});

wss.on('connection', onSocketConnection);

wss.on('close', () => {
  console.log('closed');
});

wss.on('headers', (headers) => {
  console.log({'socket info': [...headers, `PORT: ${WS_PORT}`]});
})

httpServer.on('close', () => {
  wss.close();
})
