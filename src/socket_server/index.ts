import { ERROR_MESSAGES } from './../constants';
import motionService from '../services/motion.service';
import { WebSocketServer } from 'ws';
import { parseCommand } from '../helpers/get-args';

const listen = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('connection');

    ws.on('message', async (message) => {
      const stringifiedMessage = message.toString();

      console.log(`Received message => ${stringifiedMessage}`);

      const { commandName, coordinates } = parseCommand(stringifiedMessage);

      switch (commandName) {
        case 'mouse_up':
          await motionService.moveMouse(0, -coordinates[0]);
          break;
        case 'mouse_down':
          await motionService.moveMouse(0, coordinates[0]);
          break;
        case 'mouse_left':
          await motionService.moveMouse(-coordinates[0], 0);
          break;
        case 'mouse_right':
          await motionService.moveMouse(coordinates[0], 0);
          break;
        case 'mouse_position':
          await motionService.getMousePosition();
          break;
        case 'draw_circle':
          await motionService.drawCircle(coordinates[0]);
          break;
        case 'draw_rectangle':
          await motionService.drawRectangle(coordinates[0], coordinates[1]);
          break;
        case 'draw_square':
          await motionService.drawRectangle(coordinates[0], coordinates[0]);
        default:
          ws.send(ERROR_MESSAGES.COMMAND_NOT_FOUND);
          break;
      }

      ws.send(stringifiedMessage.replace(' ', '_'));
    });
  });
};

export default { listen };
