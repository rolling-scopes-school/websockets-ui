console.log('Hello world!suka')
import Jimp from 'jimp';
import {httpServer} from './http_server';
import robot from 'robotjs';
// import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

