import { config } from 'dotenv';
import { httpServer } from "./src/http_server";
import { webSocketServer } from "./src/websocket";

config();

const wsPort = process.env.PORT || 3000;
const httpPort = process.env.HTTP_PORT || 8181;

webSocketServer(wsPort)

httpServer.listen(httpPort);
console.log(`Start static http server on the ${httpPort} port!`);
