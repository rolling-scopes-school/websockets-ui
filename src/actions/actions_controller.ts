import robot from 'robotjs';
import { Duplex } from 'stream';
import { WebSocketServer } from 'ws';
import { drawCircle, drawSquare, drawRectangle } from './drawing';
import { printScreen } from './print_screen';

export const handle = async (command: string[]) => {
  const {x, y}: {x: number, y: number} = robot.getMousePos();
  const action: string = command[0];
  const length: number = parseInt(command[1]);
  console.log(command.toString());

  switch (action) {
    case 'mouse_position':
      return `mouse_position ${x},${y}\0`;
    case 'mouse_up':
      robot.moveMouse(x, y - length);
      return `mouse_up\0`;
    case 'mouse_down':
      robot.moveMouse(x, y + length);
      return `mouse_down\0`;
    case 'mouse_left':
      robot.moveMouse(x - length, y);
      return `mouse_left\0`;
    case 'mouse_right':
      robot.moveMouse(x + length, y);
      return `mouse_right\0`;
    case 'draw_circle':
      drawCircle(length);
      return `draw_circle\0`;
    case 'draw_rectangle':
      const width: number = parseInt(command[2]);
      drawRectangle(length, width);
      return `draw_rectangle\0`;
    case 'draw_square':
      drawSquare(length);
      return `draw_square\0`;
    case 'prnt_scrn':
      const base64 = await printScreen();
      return `prnt_scrn ${base64}\0`;
  }
};
