import robot from 'robotjs';
import Jimp from 'jimp';
import { drawCircle, drawRectangle } from './draw';

export const commandHandler = async (
  command: string,
  args: Array<String>,
  ws: any
) => {
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
      drawRectangle(x, y, width, height);
      break;
    case 'prnt_scrn':
      const xSize = 200;
      const ySize = 200;
      const screen = robot.screen.capture(
        x - xSize / 2,
        y - ySize / 2,
        xSize,
        ySize
      );
      const image = new Jimp({ data: screen.image, width: 200, height: 200 });

      const imageBuffer = await image.getBase64Async('image/png');

      const splitted = imageBuffer.split(',');
      const [, base64String] = splitted;

      ws.send(`prnt_scrn ${base64String}`);
      break;
    default:
      console.log('Unknown command:', command);
  }
};
