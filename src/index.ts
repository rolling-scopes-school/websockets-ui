import * as dotenv from "dotenv";

import { httpServer } from "./server/http";
import { webSocketServer } from "./server/webSocket";

dotenv.config();

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8080;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});

console.log(`Start WebSocket server on the ${WEBSOCKET_PORT} port!`);

webSocketServer(WEBSOCKET_PORT);
