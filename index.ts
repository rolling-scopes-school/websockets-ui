import { WebSocketServer } from 'ws';

import { httpServer } from './src/http_server';
import { requestHandler } from './src/web_socket_server';

process.on('uncaughtException', (error) => {
    console.log('Internal server error');
    console.log(error);
});


const HTTP_PORT = 8181;
const WS_PORT = 3000;

httpServer.listen(HTTP_PORT);
console.log(`Start static http server on the ${HTTP_PORT} port!`);

const wss = new WebSocketServer({ port: WS_PORT });
console.log(`Start WebSocket server on the ${WS_PORT} port!`);

wss.on('connection', requestHandler);
