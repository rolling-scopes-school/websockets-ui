import * as dotenv from 'dotenv';
import { httpServer } from './http_server';
import { Button, centerOf, down, left, mouse, Point, Region, right, straightTo, up } from '@nut-tree/nut-js';
import { WebSocketServer } from 'ws';
import { actionType } from './types';

dotenv.config();

const { HTTP_PORT = '8181', WSS_PORT } = process.env;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: Number(WSS_PORT) });

wss.on('connection', ws => {
  console.log('WS connection established');
  console.log({ clients: wss.clients, options: wss.options, address: wss.address() });
  ws.on('message', async data => {
    const dataArrOfStr = data.toString().split(' ');
    const action = dataArrOfStr[0];
    const value = [
      dataArrOfStr[1] ? Number(dataArrOfStr[1]) : null,
      dataArrOfStr[2] ? Number(dataArrOfStr[2]) : null,
    ];
    console.log(action, value[0], value[1]);
  });
});

wss.on('close', () => {
  console.log('wss connection closed');
  wss.close();
});