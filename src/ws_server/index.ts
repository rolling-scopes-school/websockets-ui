import { WebSocketServer } from 'ws';
import robot from 'robotjs';
import { drawSquare, drawRectangle, drawCircle }from '../drawing/index'
import { prnt_scrn } from '../print_screen/index'

export default function start(): void {
  const wsServer: WebSocketServer = new WebSocketServer({
    port: 8080,
  });
  wsServer.on('connection', (ws) => {
    ws.on('message', (message: string) => {
      const command: string[] = message.toString().split(' ');
      var mouse: any = robot.getMousePos();

      switch (command[0]) {
        case 'mouse_position':
          ws.send(`mouse_position ${robot.getMousePos().x},${robot.getMousePos().y}`);
          break;

        case 'mouse_up':
          robot.moveMouse(mouse.x, mouse.y - Number(command[1]));
          ws.send(command[0]);
          break;

        case 'mouse_down':
          robot.moveMouse(mouse.x, mouse.y + Number(command[1]));
          ws.send(command[0]);
          break;

        case 'mouse_left':
          robot.moveMouse(mouse.x - Number(command[1]), mouse.y);
          ws.send(command[0]);
          break;

        case 'mouse_right':
          robot.moveMouse(mouse.x + Number(command[1]), mouse.y);
          ws.send(command[0]);
          break;

        case 'draw_rectangle':
          drawRectangle(Number(command[1]), Number(command[2]));
          ws.send(command[0]);
          break;

        case 'draw_square':
          drawSquare(Number(command[1]));
          ws.send(command[0]);
          break;

        case 'draw_circle':
          drawCircle(Number(command[1]))
          ws.send(command[0]);
          break;

        case 'prnt_scrn':
          prnt_scrn(mouse.x, mouse.y, 100, 100)
          break;

        default:
          console.log('error');
          break;
      }
    })

    ws.on('close', (message: string) => {
      console.log(`WS server closed`);
    })
  })
}
