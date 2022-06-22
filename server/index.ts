import { WebSocketServer, createWebSocketStream } from 'ws';
import { commandSwitcher } from '../commandSwitcher';
import { prepareCommands } from '../utils';
import { IWS } from '../interfaces';
import 'dotenv/config';

const wws = new WebSocketServer({
  port: process.env.SERVER_PORT,
});

wws.on('connection', (ws: IWS) => {
  console.log('client connected');

  const duplex = createWebSocketStream(ws);

  duplex.on('data', (data: Buffer) => {
    if (Buffer.isBuffer(data)) {
      commandSwitcher({ ...prepareCommands(data.toString()), ws });
    }
  });

  duplex.on('close', () => {
    console.log('the duplex channel has closed');
  });

  ws.on('close', () => {
    console.log('error');
  });
});
