import { WebSocketServer, createWebSocketStream } from 'ws';
import { commandSwitcher } from '../commandSwitcher';
import { getErrorMessage, prepareCommands, reportError, showCommands, showWebSocketInfo } from '../utils';
import { IWS } from '../interfaces';
import { IncomingMessage } from 'http';
import 'dotenv/config';

const wws = new WebSocketServer({
  port: process.env.SERVER_PORT,
});

wws.on('connection', (ws: IWS, request: IncomingMessage) => {
  showWebSocketInfo(request);

  const duplex = createWebSocketStream(ws, {
    decodeStrings: false,
  });

  duplex.on('data', (data: Buffer) => {
    if (Buffer.isBuffer(data)) {
      showCommands(data.toString());
      commandSwitcher({ ...prepareCommands(data.toString()), duplex });
    }
  });

  duplex.on('close', () => {
    console.log('the channel has closed');
  });

  wws.on('close', (event) => {
    reportError({ message: getErrorMessage(event) });
  });
});
