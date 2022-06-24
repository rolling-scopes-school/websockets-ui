import robot from 'robotjs';
import type { IMousePosition } from '../interfaces';
import { circle, rectangle, square } from '../robot';

export default function redirectToFuntion(command: string[], ws: any): void {
  const cord: IMousePosition = robot.getMousePos();
  switch (command[0]) {
    case 'mouse_position':
      ws.send(`mouse_position ${cord.x},${cord.y}`);
      console.log(`<- ${command[0]}`);
      console.log(`-> ${command[0]} ${cord.x} ${cord.y}`);
      break;
    case 'mouse_left':
      if (command[1]) {
        robot.moveMouse(cord.x - Number(command[1]), cord.y);
        console.log(`<- ${command[0]} ${cord.x - Number(command[1])}`);
        ws.send(command[0]);
      }

      break;
    case 'mouse_right':
      if (command[1]) {
        robot.moveMouse(cord.x + Number(command[1]), cord.y);
        console.log(`<- ${command[0]} ${cord.x + Number(command[1])}`);
        ws.send(command[0]);
      }

      break;
    case 'mouse_up':
      if (command[1]) {
        robot.moveMouse(cord.x, cord.y - Number(command[1]));
        console.log(`<- ${command[0]} ${cord.y - Number(command[1])}`);
        ws.send(command[0]);
      }

      break;
    case 'mouse_down':
      if (command[1]) {
        robot.moveMouse(cord.x, cord.y + Number(command[1]));
        console.log(`<- ${command[0]} ${cord.y + Number(command[1])}`);
        ws.send(command[0]);
      }

      break;
    case 'draw_circle':
      if (command[1]) {
        console.log(`<- ${command[0]} ${command[1]}`);
        circle(Number(command[1]));
      }
      ws.send(command[0]);
      break;
    case 'draw_square':
      if (command[1]) {
        console.log(`<- ${command[0]} ${command[1]}`);
        square(Number(command[1]));
      }
      ws.send(command[0]);
      break;
    case 'draw_rectangle':
      if (command[1] && command[2]) {
        console.log(`<- ${command[0]} ${command[1]} ${command[2]}`);
        rectangle(Number(command[1]), Number(command[2]));
      }
      ws.send(command[0]);
      break;
    default:
      console.log('error');
      break;
  }
}
