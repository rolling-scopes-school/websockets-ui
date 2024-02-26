import { httpServer } from "./src/http_server/index";
import {WS_connection} from "./src/websocket_connection/ws_connection";
import {requestHandlerImpl} from "./src/proxy/requestHandler";

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const ws_connection = new WS_connection(WS_PORT, requestHandlerImpl)
ws_connection.startConnection()
