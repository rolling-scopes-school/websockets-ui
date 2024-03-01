import "dotenv/config";
import { httpServer } from './src/http_server';
import { wss } from './src/server/websocket';
import { Server } from './src/server';

const HTTP_PORT =  8181;

console.log(`Http server started on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const server = new Server(wss);

server.start();
