import { WebSocketServer } from 'ws';
import robot from 'robotjs';
import type { IMousePosition } from '../interfaces';
import { circle, rectangle, square } from '../robot';

export default function startWebSocketServer(): void {
  const wsServer: WebSocketServer = new WebSocketServer({
    port: 8080,
  });
  wsServer.on('connection', (ws) => {
    ws.on('message', (message: string) => {
      const command: string[] = message.toString().split(' ');

      const cord: IMousePosition = robot.getMousePos();
      switch (command[0]) {
        case 'mouse_position':
          ws.send(`mouse_position ${robot.getMousePos().x},${robot.getMousePos().y}`);
          break;
        case 'mouse_left':
          if (command[1]) {
            robot.moveMouse(cord.x - Number(command[1]), cord.y);
            ws.send(command[0]);
          }

          break;
        case 'mouse_right':
          if (command[1]) {
            robot.moveMouse(cord.x + Number(command[1]), cord.y);
            ws.send(command[0]);
          }

          break;
        case 'mouse_up':
          if (command[1]) {
            robot.moveMouse(cord.x, cord.y - Number(command[1]));
            ws.send(command[0]);
          }

          break;
        case 'mouse_down':
          if (command[1]) {
            robot.moveMouse(cord.x, cord.y + Number(command[1]));
            ws.send(command[0]);
          }

          break;
        case 'draw_circle':
          if (command[1]) {
            circle(Number(command[1]));
          }

          break;
        case 'draw_square':
          if (command[1]) {
            square(Number(command[1]));
          }

          break;
        case 'draw_rectangle':
          if (command[1] && command[2]) {
            rectangle(Number(command[1]), Number(command[2]));
          }

          break;
        case 'prnt_scrn':
          break;
        default:
          console.log('error');
          break;
      }
    });
    ws.send('text');
  });
  wsServer.on('close', () => {
    // eslint-disable-next-line no-console
    console.log('exit server');
  });
}
