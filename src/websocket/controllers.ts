import { drawCircle, drawRectangle } from '../drawing_function/draw';
import { getImage } from '../print_screen/getImage';
import robot from 'robotjs';

export const controller = (duplex: any, command: string, value: string) => {
  try {
    const screenSize = robot.getScreenSize();
    let mouse = robot.getMousePos();
    let limitValue = +value;

    switch (command) {
      case 'mouse_up':
        limitValue > mouse.y ? (limitValue = mouse.y - 1) : limitValue;
        robot.moveMouse(mouse.x, mouse.y - limitValue);
        break;
      case 'mouse_down':
        if (mouse.y < screenSize.height - 25) {
          robot.moveMouse(mouse.x, mouse.y + +value);
        }
        break;
      case 'mouse_left':
        limitValue > mouse.y ? (limitValue = mouse.x - 1) : limitValue;
        robot.moveMouse(mouse.x - +value, mouse.y);
        break;
      case 'mouse_right':
        if (mouse.x < screenSize.width - 15) {
          robot.moveMouse(mouse.x + +value, mouse.y);
        }
        break;
      case 'mouse_position':
        let { x, y } = robot.getMousePos();
        duplex.write(`${command} ${x},${y}\0`);
        break;
      case 'draw_circle':
        drawCircle(value);
        break;
      case 'draw_square':
        drawRectangle(value);
        break;
      case 'draw_rectangle':
        drawRectangle(value);
        break;
      case 'prnt_scrn':
        getImage(duplex);
        break;
      default:
        duplex.write(`Don't know this command: ${command}\0`);
    }
    console.log(`${command} completed successfully`)
  } catch (error) {
    console.log(`${command} completed unsuccessfully`)
  }
}