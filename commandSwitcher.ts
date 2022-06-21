import { COMMANDS } from './constants';
import robot, { Bitmap } from 'robotjs';
import Mouse from './src/mouse/mouse';
import Capture from './src/capture/capture';
import Circle from './src/circle/circle';
import Square from './src/square/square';
import Rectangle from './src/rectangle/rectangle';
import { IMousePosition, IWS } from './interfaces';

export const commandSwitcher = ({ command, props, ws }: { command: string; props: number[]; ws: IWS }): void => {
  const mouse: Mouse = new Mouse(robot);
  const capture: Capture = new Capture(robot);
  const circle: Circle = new Circle(robot);
  const square: Square = new Square(robot);
  const rectangle: Rectangle = new Rectangle(robot);
  const position: IMousePosition = mouse.mousePosition();
  const [sendPosition]: number[] = props;

  switch (command) {
    case COMMANDS.MOUSE_UP:
      mouse.moseMove({ action: COMMANDS.MOUSE_UP, position: sendPosition });
      ws.send(COMMANDS.MOUSE_UP);
      break;
    case COMMANDS.MOUSE_DOWN:
      mouse.moseMove({ action: COMMANDS.MOUSE_DOWN, position: sendPosition });
      ws.send(COMMANDS.MOUSE_DOWN);
      break;
    case COMMANDS.MOUSE_LEFT:
      mouse.moseMove({ action: COMMANDS.MOUSE_LEFT, position: sendPosition });
      ws.send(COMMANDS.MOUSE_LEFT);
      break;
    case COMMANDS.MOUSE_RIGHT:
      mouse.moseMove({ action: COMMANDS.MOUSE_RIGHT, position: sendPosition });
      ws.send(COMMANDS.MOUSE_RIGHT);
      break;

    case COMMANDS.MOUSE_POSITION:
      ws.send(JSON.stringify(position));
      break;

    case COMMANDS.DRAW_CIRCLE:
      circle.drawCircle(sendPosition);
      ws.send(COMMANDS.DRAW_CIRCLE);
      break;
    case COMMANDS.DRAW_SQUARE:
      square.drawSquare(sendPosition);
      ws.send(COMMANDS.DRAW_SQUARE);
      break;
    case COMMANDS.DRAW_RECTANGLE:
      rectangle.drawRectangle(props);
      ws.send(COMMANDS.DRAW_RECTANGLE);
      break;

    case COMMANDS.PRINT_SCREEN:
      ws.send(capture.getScreenCapture());
      break;
    default:
  }
};
