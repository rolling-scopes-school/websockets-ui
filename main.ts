import dotenv from "dotenv";
import { httpServer } from "./src/http_server/index";
import { WsServer } from "./src/ws_server/index";
dotenv.config();

const HTTP_PORT = 8181;
const WS_PORT = +process.env.WS_PORT || 3000;

new WsServer(WS_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
