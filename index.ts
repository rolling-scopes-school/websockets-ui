import Jimp from 'jimp';
import { httpServer } from './src/http_server';
import WebSocket from 'ws';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { PORT, URL_PATH } from './constants';
import { getErrorMessage, reportError } from './utils';

const HTTP_PORT = PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocket(URL_PATH);
