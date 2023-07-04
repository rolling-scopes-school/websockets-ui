import { httpServer } from "./src/http_server";
import { start_WSS } from "./src/ws_server";


const HTTP_PORT = 8181;


console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
start_WSS()