//import Jimp from "jimp";
import 'dotenv/config';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

import { httpServer } from './http_server';

const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = parseInt(process.env.WEBSOCKET_PORT || '8080');

httpServer.listen(PORT, () => {
  console.log(`Start static http server on the ${PORT} port!`);
});

const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

wss.on('connection', (ws) => {
  console.log('Connection accepted');
});

wss.on('message', (data: BinaryData) => {
  console.log(data.toString());

  robot.getMousePos();
  // const [cmd, coord] = data.toString().split(' ');
  // const { x, y } = robot.getMousePos();
  //
  // switch (cmd) {
  //   case 'mouse_position':
  //     ws.send(`mouse_position ${x},${y}`);
  //     break;
  //
  //   case 'mouse_up':
  //     robot.moveMouseSmooth(x, y + coord, 1);
  //     ws.send(`mouse_position ${x},${y}`);
  // }
});
wss.on('close', () => {
  //Close connection
});
