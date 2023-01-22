import { httpServer } from "./httpServer";
import { wsServer } from "./wsServer";
import { env } from "node:process";
import { config } from "dotenv";

config();

const httpPort = +(env.HTTP_PORT ?? 8181);
const wsPort = +(env.WSS_PORT ?? 8080);

console.log(`Start static http server on the ${httpPort} port!`);
const webServer = httpServer.listen(httpPort);

console.log(`Start ws server on the ${wsPort} port!`);
const webSocketServer = wsServer(wsPort);

process.on("SIGINT", () => {
  console.log("Server down");
  webServer.close();
  webSocketServer.close();
  process.exit(0);
});
