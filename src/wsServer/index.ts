import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';
import { handleCommand } from './handler/command';

const wsServer = (port: number) => {
  const server = new WebSocketServer({ port });

  server.on('connection', (ws: WebSocket) => {
    console.log('New connection');

    ws.on('close', () => {
      console.log('Connection closed');
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
        console.log(data);

        const response = await handleCommand(data);
        duplex.write(response);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        console.log('Error: ', errorMessage);
      }
    });
  });
};

export default wsServer;
