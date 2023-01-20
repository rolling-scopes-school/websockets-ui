import { httpServer } from "./http_server";
import { mouse } from "@nut-tree/nut-js";
import { wsServer } from "./ws_server";

const HTTP_PORT = 8181;
const WSS_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
const webServer = httpServer.listen(HTTP_PORT);

console.log(`Start ws server on the ${WSS_PORT} port!`);
const webSocketServer = wsServer(WSS_PORT);

process.on("SIGINT", () => {
  webServer.close();
  webSocketServer.close();
  console.log("Server down");
  process.exit(0);
});
