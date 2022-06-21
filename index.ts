import Jimp from 'jimp';
import { httpServer } from './src/http_server';
import WebSocket from 'ws';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import 'dotenv/config';
import { getErrorMessage, reportError } from './utils';

const HTTP_PORT: string = process.env.FRONT_PORT;
const SERVER_PORT: string = `${process.env.WEB_SOCKET_URL}:${process.env.SERVER_PORT}`;

httpServer.listen(HTTP_PORT);

const socket: WebSocket = new WebSocket(SERVER_PORT);

socket.onerror = (error) => {
  console.log(error.message);
};

socket.onopen = () => {
  console.log('Connection opened...');
};

socket.onmessage = (event): void => {
  console.log(`[message] Data received from the server: ${event}`);
};
