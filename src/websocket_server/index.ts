import { WebSocketServer } from 'ws';
import robot from 'robotjs';
import type { IMousePosition } from '../interfaces';

export default function startWebSocketServer(): void {
  const wsServer: WebSocketServer = new WebSocketServer({
    port: 8080,
  });
  wsServer.on('connection', (ws) => {
    console.log('User connection');
    ws.on('message', (message: string) => {
      const command: string[] = message.toString().split(' ');
      console.log(command);
      const cord: IMousePosition = robot.getMousePos();
      switch (command[0]) {
        case 'mouse_position':
          ws.send(`mouse_position ${cord.x},${cord.y}`);
          console.log(`mouse_position ${cord.x},${cord.y}`);
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
        default:
          console.log('error');
          break;
      }
    });
    ws.send('text');
  });
  wsServer.on('close', () => {
    console.log('exit server');
  });
}
