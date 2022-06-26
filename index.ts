import robot from 'robotjs';
import WebSocket, { WebSocketServer } from 'ws';
import { EOL } from 'os';
import 'dotenv/config';
import { httpServer } from './src/http_server/index';
import { write, makeOperations } from './src/utils';
import {
  sendCoords,
  drawCircle,
  drawSquare,
  drawReactagle,
  up,
  down,
  right,
  left,
} from './src/mouseFuncs';
import printScreen from './src/screen/printScreen';

const { pid, env }: { pid: number; env: object } = process;
const { PORT, WSPORT }: any = env;

httpServer.listen(PORT);
write(
  `${EOL}Start static http server on the ${PORT} port!
Server pid: ${pid}
Websocket able to be run at: ${WSPORT} port`
);

const wss = new WebSocketServer({ port: WSPORT });

wss.on('connection', (ws: WebSocket) => {
  ws.send('open');
  sendCoords(ws);

  ws.on('message', async (data: Buffer) => {
    const input = String(data);
    const [command, param1, param2] = input.split(' ');

    switch (command) {
      case 'mouse_position':
        const { x, y } = robot.getMousePos();
        const msg: string = 'mouse_position' + '_x_' + x + '_y_' + y;
        return makeOperations(msg, sendCoords(ws));
      case 'mouse_up':
        return makeOperations(input, up(ws, param1));
      case 'mouse_down':
        return makeOperations(input, down(ws, param1));
      case 'mouse_right':
        return makeOperations(input, right(ws, param1));
      case 'mouse_left':
        return makeOperations(input, left(ws, param1));
      case 'draw_circle':
        return makeOperations(input, drawCircle(ws, param1));
      case 'draw_square':
        return makeOperations(input, drawSquare(ws, param1));
      case 'draw_rectangle':
        return makeOperations(input, drawReactagle(ws, param1, param2));
      case 'prnt_scrn':
        return makeOperations(
          'prnt_scrn base64 string (png buf)',
          printScreen(ws)
        );
      default:
        write(`Unknown input: ${input}`);
    }
  });

  ws.on('close', () => {
    ws.send('closed\0');
    write('Websocket closed');
    ws.close();
  });
});

process.on('SIGINT', () => {
  write(
    `Server (port ${PORT}) and and websocket (port ${WSPORT}) are closed\n`
  );
  wss.close();
  httpServer.close();
});

process.on('exit', () => {
  write(
    `Server (port ${PORT}) and and websocket (port ${WSPORT}) are closed\n`
  );
  wss.close();
  httpServer.close();
});
