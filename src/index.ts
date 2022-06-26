import { httpServer } from "./http_server/index.js";
import { startWebsocketsServer } from "./ws-server/server.js";
import "dotenv/config";

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;
const WS_PORT = Number(process.env.WS_PORT) || 8080;

httpServer.listen(HTTP_PORT);
console.log(
  `Start frontend static http server on the ${HTTP_PORT} port! http://localhost:${HTTP_PORT}`
);

startWebsocketsServer(WS_PORT);
console.log(`Start WS server on the ${WS_PORT} port! http://localhost:${WS_PORT}`);
