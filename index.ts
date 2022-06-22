import { httpServer } from './src/http_server';
import WebSocket from 'ws';
import 'dotenv/config';

const HTTP_PORT: string = process.env.FRONT_PORT;
const SERVER_URL: string = `${process.env.WEB_SOCKET_URL}:${process.env.SERVER_PORT}`;

httpServer.listen(HTTP_PORT);

const socket: WebSocket = new WebSocket(SERVER_URL);

socket.onerror = (error): void => {
  console.log(error.message);
};

socket.onopen = (): void => {
  console.log('Connection opened...');
};

socket.onmessage = (event): void => {
  console.log(`[message] Data received from the server: ${event}`);
};
