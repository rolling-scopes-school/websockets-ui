import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';
import { drawCircle, drawRectangle } from './src/drawing_function/draw';
import { getImage } from './src/print_screen/getImage';
import robot from 'robotjs';

const socket = new WebSocket('ws://localhost:8080');
const wss = new WebSocketServer({ port: 8080 });

wss.on('headers', (data) => {
  console.log(data);
});

wss.on('connection', (ws) => {
  const duplex = createWebSocketStream(ws, {
    encoding: 'utf-8',
    decodeStrings: false
  });

  duplex.on('data', (chunk) => {
    console.log('received: %s', chunk);
    const dataArray = chunk.toString().split(' ');
    const [command, value] = [dataArray.shift(), dataArray.join(' ')];
    try {
      const screenSize = robot.getScreenSize();
      let mouse = robot.getMousePos();
      let limitValue = +value;

      switch (command) {
        case 'mouse_up':
          limitValue > mouse.y ? (limitValue = mouse.y - 1) : limitValue;
          robot.moveMouse(mouse.x, mouse.y - limitValue);
          duplex.write(`${command}\0`);
          break;
        case 'mouse_down':
          if (mouse.y < screenSize.height - 25) {
            robot.moveMouse(mouse.x, mouse.y + +value);
            duplex.write(`${command}\0`);
          }
          break;
        case 'mouse_left':
          limitValue > mouse.y ? (limitValue = mouse.x - 1) : limitValue;
          robot.moveMouse(mouse.x - +value, mouse.y);
          duplex.write(`${command}\0`);
          break;
        case 'mouse_right':
          if (mouse.x < screenSize.width - 15) {
            robot.moveMouse(mouse.x + +value, mouse.y);
            duplex.write(`${command}\0`);
          }
          break;
        case 'mouse_position':
          let { x, y } = robot.getMousePos();
          duplex.write(`${command} ${x},${y}\0`);
          break;
        case 'draw_circle':
          drawCircle(value);
          robot.mouseToggle('up');
          duplex.write(`${command}\0`);
          break;
        case 'draw_square':
          drawRectangle(value);
          robot.mouseToggle('up');
          duplex.write(`${command}\0`);
          break;
        case 'draw_rectangle':
          drawRectangle(value);
          robot.mouseToggle('up');
          duplex.write(`${command}\0`);
          break;
        case 'prnt_scrn':
          getImage(duplex);
          duplex.write(`${command}\0`);
          break;
        default:
          duplex.write(`Don't know this command: ${command}\0`);
      }
      console.log(`${command} completed successfully`)
    } catch (error) {
      console.log(`${command} completed unsuccessfully`)
    }
  });
});

wss.on('error', (error) => {
  console.log(error);
});

wss.on('close', () => {
  console.log('Server closed');
});

process.on('SIGINT', function () {
  console.log('\nWebsocket closed successfully');

  socket.close();

  process.exit();
});
