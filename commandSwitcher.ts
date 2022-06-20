import { COMMANDS } from './constants';
import robot, { Bitmap } from 'robotjs';
import Mouse from './src/mouse/mouse';
import Capture from './src/capture/capture';
import { IMousePosition, IWS } from './interfaces';

export const commandSwitcher = ({ command, props, ws }: { command: string; props: number[]; ws: IWS }): void => {
  const mouse: Mouse = new Mouse(robot);
  const capture: Capture = new Capture(robot);
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

    case COMMANDS.PRINT_SCREEN:
      const img: Bitmap = capture.getScreenCapture();
      ws.send(JSON.stringify(img));
      break;
    default:
  }
};
