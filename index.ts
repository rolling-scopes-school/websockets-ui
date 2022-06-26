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
import constants from './src/constants';

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
  const { x, y } = robot.getMousePos();
  const msg: string =
    constants.MOUSE_POSITION + ' ' + x + 'px' + ',' + y + 'px';
  sendCoords(ws, msg);

  ws.on('message', async (data: Buffer) => {
    const input = String(data);
    const [command, param1, param2] = input.split(' ');

    switch (command) {
      case constants.MOUSE_POSITION:
        const { x, y } = robot.getMousePos();
        const msg: string =
          constants.MOUSE_POSITION + ' ' + x + 'px' + ',' + y + 'px';
        return makeOperations(msg, sendCoords(ws, msg));
      case constants.MOUSE_UP:
        return makeOperations(input, up(ws, param1));
      case constants.MOUSE_DOWN:
        return makeOperations(input, down(ws, param1));
      case constants.MOUSE_RIGHT:
        return makeOperations(input, right(ws, param1));
      case constants.MOUSE_LEFT:
        return makeOperations(input, left(ws, param1));
      case constants.DRAW_CIRCLE:
        return makeOperations(input, drawCircle(ws, param1));
      case constants.DRAW_SQAURE:
        return makeOperations(input, drawSquare(ws, param1));
      case constants.DRAW_RECTANGLE:
        return makeOperations(input, drawReactagle(ws, param1, param2));
      case constants.PRINT_SCREEN:
        return makeOperations(constants.PRINT_SCREN_SETTINGS, printScreen(ws));
      default:
        write(`Unknown input: ${input}`);
    }
  });

  ws.on('close', () => {
    ws.send('closed');
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
