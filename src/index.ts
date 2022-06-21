// import Jimp from 'jimp';
import { httpServer } from './http_server';
// import robot from 'robotjs';
import startWebSocketServer from './websocket-server';
import './config'
import './robot'

const HTTP_PORT:string|undefined = process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);

httpServer.listen(HTTP_PORT);
startWebSocketServer()
