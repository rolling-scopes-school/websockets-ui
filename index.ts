import { httpServer } from './src/http_server/index';
import { createWebSocketStream, WebSocketServer } from 'ws';
import { handle } from './src/actions/actions_controller';
import { Duplex } from 'stream';

const HTTP_PORT = 3000;
httpServer.listen(HTTP_PORT)
console.log(`Static http server started on http://localhost:${HTTP_PORT}`);

const WS_PORT = 8080;
const server = new WebSocketServer({ port: WS_PORT });

server.on('connection', (socket) => {
  const duplex: Duplex = createWebSocketStream(socket, { decodeStrings: false });  
  duplex.write(`connection_established\0`);
  duplex.write(`port_${WS_PORT}\0`);
  duplex.on('error', console.error);

  duplex.on('data', async (chunk) => {
    const command: string[] = chunk.toString().split(' ');
    duplex.write(await handle(command));
  })

  socket.on('close', () => {
    console.log('closed the connection');
  })
});
