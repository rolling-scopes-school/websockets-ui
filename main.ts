import { httpServer } from "./src/http_server/index";
import { WsServer } from "./src/ws_server/ws-server";
import dotenv from "dotenv";
dotenv.config();

const HTTP_PORT = 8181;
const WS_PORT = +process.env.WS_PORT || 3000;

const wsServer = new WsServer();

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
wsServer.start(WS_PORT);
