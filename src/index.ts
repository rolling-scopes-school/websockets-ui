//import Jimp from "jimp";
import 'dotenv/config';
import { WebSocketServer } from 'ws';

import { httpServer } from './http_server';
import { handleClose, handleConnection } from './WebsocketServer';

const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = parseInt(process.env.WEBSOCKET_PORT || '8080');

httpServer.listen(PORT, () => {
  console.log(`Start static http server on the ${PORT} port!`);
});

const ws = new WebSocketServer({ port: WEBSOCKET_PORT });
ws.on('connection', handleConnection);
ws.on('close', handleClose);
