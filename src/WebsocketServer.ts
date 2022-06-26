import robot from 'robotjs';
import WebSocket from 'ws';

import { drawCircle, drawRectangle } from './drawMethods';
import { makeScreenshot } from './makeScreenshot';

const handleMessage = (ws: WebSocket) => async (data: Buffer) => {
  const [cmd, num = '', rectangleLength] = data.toString().split(' ');

  const { x: x1, y: y1 } = robot.getMousePos();
  const offset = parseFloat(num);

  switch (cmd) {
    case 'mouse_position':
      ws.send(`mouse_position {${x1}},{${y1}}`);
      break;

    case 'mouse_up':
      robot.moveMouseSmooth(x1, Math.max(y1 - offset, 0));
      break;
    case 'mouse_down':
      robot.moveMouseSmooth(x1, y1 + offset);
      break;
    case 'mouse_left':
      robot.moveMouseSmooth(Math.max(x1 - offset, 0), y1);
      break;
    case 'mouse_right':
      robot.moveMouseSmooth(x1 + offset, y1);
      break;

    case 'draw_square':
      drawRectangle(offset);
      break;

    case 'draw_rectangle':
      drawRectangle(offset, rectangleLength);
      break;

    case 'draw_circle':
      drawCircle(offset);
      break;

    case 'prnt_scrn':
      await makeScreenshot(ws);
  }

  ws.send(cmd + '\0');
};

export const handleConnection = (ws: WebSocket) => {
  console.log('Connection accepted');
  ws.on('message', handleMessage(ws));
};

export const handleClose = (data: unknown) => {
  console.log(data);
};
