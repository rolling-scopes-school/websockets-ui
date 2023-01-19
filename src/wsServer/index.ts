import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';
import { handleCommand, parseCommand } from './command/commandHandler';
import log from '../shared/logger';

const wsServer = (port: number) => {
  const server = new WebSocketServer({ port });

  server.on('connection', (ws: WebSocket) => {
    log('New connection');

    ws.on('close', () => {
      log('Connection closed!');
    });

    const duplex = createWebSocketStream(ws, {
      encoding: 'utf8',
      decodeStrings: false,
    });

    duplex.on('close', () => {
      server.close();
    });

    duplex.on('data', async (data: string) => {
      try {
        log(data);

        const response = await handleCommand(data);

        duplex.write(response);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        log(`Error: ${errorMessage}`);

        duplex.write(`error`);
      }
    });
  });
};

export default wsServer;
