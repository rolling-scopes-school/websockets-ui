import WebSocket, { createWebSocketStream } from 'ws';
import { controller } from './controllers';

export const createStream = (ws: WebSocket.WebSocket) => {
  ws.send('Wait_commands\0')

  const duplex = createWebSocketStream(ws, {
    encoding: 'utf-8',
    decodeStrings: false
  });

  duplex.on('data', (chunk) => {
    console.log('received: %s', chunk);
    const dataArray = chunk.toString().split(' ');
    const [command, value] = [dataArray.shift(), dataArray.join(' ')];

    switch (command) {
      case ('mouse_position'):
        controller(duplex, command, value);
        break;
      default:
        controller(duplex, command, value);
        duplex.write(`${command}\0`);
    }
  });
};
