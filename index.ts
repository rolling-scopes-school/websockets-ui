import { httpServer } from "./src/http_server/index";
import  { startWebSocket }  from './src/ws';
import { mouse } from "@nut-tree/nut-js";
import { WebSocketServer } from "ws";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

startWebSocket();

