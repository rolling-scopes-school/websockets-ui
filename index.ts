import Jimp from 'jimp';
import { httpServer } from './src/http_server';
import WebSocket from 'ws';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import 'dotenv/config';
import { getErrorMessage, reportError } from './utils';

const HTTP_PORT: string = process.env.FRONT_PORT;
const SERVER_PORT: string = `${process.env.WEB_SOCKET_URL}:${process.env.SERVER_PORT}`;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket: WebSocket = new WebSocket(SERVER_PORT);
