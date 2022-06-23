import robot from 'robotjs';
import { drawCircle, drawRectangle } from './draw';

export const commandHandler = (command: string, args: Array<String>) => {
  const { x, y } = robot.getMousePos();
  const argsToNumber = args.map((arg) => Number(arg));
  switch (command) {
    case 'mouse_up':
      robot.moveMouse(x, y - argsToNumber[0]);
      break;
    case 'mouse_down':
      robot.moveMouse(x, y + argsToNumber[0]);
      break;
    case 'mouse_left':
      robot.moveMouse(x - argsToNumber[0], y);
      break;
    case 'mouse_right':
      robot.moveMouse(x + argsToNumber[0], y);
      break;
    case 'draw_circle':
      const radius = argsToNumber[0];
      drawCircle(x, y, radius);
      break;
    case 'draw_square': {
      const [width] = argsToNumber;
      drawRectangle(x, y, width, width);
      break;
    }
    case 'draw_rectangle':
      const [width, height] = argsToNumber;
      console.log(width, height);
      drawRectangle(x, y, width, height);
      break;
    default:
      console.log('Unknown command:', command);
  }
};
