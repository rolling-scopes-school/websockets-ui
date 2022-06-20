import { WebSocketServer, WebSocket } from 'ws';
import { commandSwitcher } from '../commandSwitcher';
import { prepareCommands } from '../utils';
import { IWS } from '../interfaces';

const wws: WebSocket = new WebSocketServer({
  port: 8080,
});

wws.on('connection', (ws: IWS): void => {
  ws.on('message', (data: Buffer) => {
    if (Buffer.isBuffer(data)) {
      commandSwitcher({ ...prepareCommands(data.toString()), ws });
    }
  });
});

wws.on('close', () => {
  console.log('close');
});
