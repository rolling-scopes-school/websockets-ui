import { WebSocketServer } from 'ws';
import robot from 'robotjs';
import { drawSquare }from '../drawing/index'

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
          console.log("draw_rectangle")
          break;
        case 'draw_square':
          drawSquare(Number(command[1]));
          ws.send(command[0]);
          break;
        case 'draw_circle':
          console.log("draw_circle")
          break;
        case 'prnt_scrn':
          console.log("prnt_scrn")
          break;
        default:
          console.log('error');
          break;
      }
    })
  })
}
