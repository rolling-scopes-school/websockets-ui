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

const drawRectangle = async (width, length) => {
  await mouse.pressButton(Button.LEFT);
  await mouse.move(right(width));
  await mouse.move(down(length));
  await mouse.move(left(width));
  await mouse.move(up(length));
  await mouse.releaseButton(Button.LEFT);
};

const drawSquare = async (width) => {
  await mouse.pressButton(Button.LEFT);
  await mouse.move(right(width));
  await mouse.move(down(width));
  await mouse.move(left(width));
  await mouse.move(up(width));
  await mouse.releaseButton(Button.LEFT);
};

const drawCircle = async (radius) => {
  await mouse.pressButton(Button.LEFT);
  const positionPoint = await mouse.getPosition();
  const { x, y } = positionPoint;
  const circleCenterX = x;
  const circleCenterY = y + radius;
  const stepAngle = 2 * Math.PI / 3600;
  for (let initAngle = -(2 * Math.PI) * 3 / 4; initAngle < (2 * Math.PI) * 1 / 4; initAngle += stepAngle) {
    const x = circleCenterX + radius * Math.cos(initAngle);
    const y = circleCenterY - radius * Math.sin(initAngle);
    await mouse.setPosition(new Point(x, y));
  }
  await mouse.releaseButton(Button.LEFT);
};

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
    switch (action) {
      case actionType.MOVE_RIGHT: {
        await mouse.move(right(value[0]));
        break;
      }
      case actionType.MOVE_LEFT: {
        await mouse.move(left(value[0]));
        break;
      }
      case actionType.MOVE_UP: {
        await mouse.move(up(value[0]));
        break;
      }
      case actionType.MOVE_DOWN: {
        await mouse.move(down(value[0]));
        break;
      }
      case actionType.DRAW_CIRCLE: {
        await drawCircle(value[0]);
        break;
      }
      case actionType.DRAW_SQUARE: {
        await drawSquare(value[0]);
        break;
      }
      case actionType.DRAW_RECTANGLE: {
        await drawRectangle(value[0], value[1]);
        break;
      }
    }
  });
});

wss.on('close', () => {
  console.log('wss connection closed');
  wss.close();
});