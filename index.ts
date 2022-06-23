import Jimp from 'jimp';
import { httpServer } from './src/http_server/index';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { commandHandler } from './src/commandHandler';
const HTTP_PORT = 3000;

console.log(
  `Start static http server on the ${HTTP_PORT} port! \n http://localhost:${HTTP_PORT}/`
);
httpServer.listen(HTTP_PORT);
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('connection');
  ws.on('message', (data: any) => {
    const [command, ...args] = data.toString().split(' ');
    try {
      commandHandler(command, args);
      const { x, y } = robot.getMousePos();
      ws.send(`${command} ${x},${y}`);
    } catch (err) {
      ws.send(err);
    }
    console.log('command', command);
    console.log('args', args);
  });
});
