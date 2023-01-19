import { WebSocketServer } from 'ws';
import { mouse, left, right, up, down, Point } from '@nut-tree/nut-js';

const navigationCommands = {
  mouse_up: 'mouse_up',
  mouse_down: 'mouse_down',
  mouse_left: 'mouse_left',
  mouse_right: 'mouse_right',
  mouse_position: 'mouse_position',
  draw_circle: 'draw_circle',
  draw_rectangle: 'draw_rectangle',
  draw_square: 'draw_square',
  prnt_scrn: 'prnt_scrn'
}

const execCommand = async (inputCommand) => {
  const arrParams = inputCommand.split(' ');
    switch (navigationCommands[arrParams[0]]) {
      case navigationCommands.mouse_up:
        await mouse.move(up(+arrParams[1]));
        break;
      case navigationCommands.mouse_right:
        await mouse.move(right(+arrParams[1]));
        break;
      case navigationCommands.mouse_down:
        await mouse.move(down(+arrParams[1]));
        break;
      case navigationCommands.mouse_left:
        await mouse.move(left(+arrParams[1]));
        break;
      case navigationCommands.mouse_position:
        const target = new Point(0, 0);
        await mouse.setPosition(target);
        break;        
      default:
        console.log('Command not found');
        break;
    }
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  ws.on('message', function message(data) {
    execCommand(data.toString());
  });

});

wss.on('close', () => { console.log('Disconnected!')});
