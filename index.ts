import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import ws from 'ws';
import { WebSocketServer, createWebSocketStream } from 'ws';
import { dataParser } from './src/dataParser.js';

const HTTP_PORT = 3000;
const WS_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);

const wsServer = new WebSocketServer({ port : WS_PORT});
wsServer.on('connection', (ws: ws.WebSocket) => {
    console.log(`Web socket server on the ${WS_PORT} port!`);
    ws.on('message', (data: ws.RawData) => {
    const duplex = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });
    const dataArr = data.toString().split(' ');
    const action = dataArr[0];
    const height = +dataArr[1];
    const width = +dataArr[2];
    dataParser(action, height, width, duplex);
    });

})
httpServer.listen(HTTP_PORT);
