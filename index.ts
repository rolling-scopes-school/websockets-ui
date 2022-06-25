import { httpServer } from "./src/http_server/index.js";
import WebSocket, { WebSocketServer, createWebSocketStream } from "ws";
import { controller } from "./src/controller.js";

const HTTP_PORT = 3000;
const WS_PORT = 8080;

console.log(
  `Start static http server on the ${HTTP_PORT} port! http://localhost:${HTTP_PORT}`
);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", function connection(ws: WebSocket.WebSocket) {
  const duplex = createWebSocketStream(ws, { encoding: "utf8", decodeStrings: false });
  duplex.on("data", async function message(data) {
    console.log("duplex received: %s", data.toString());
    await controller(duplex, data.toString());
  });
});

console.log(`Start WS server on the ${WS_PORT} port! http://localhost:${WS_PORT}`);

process.on("SIGINT", shutDown);

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  wss.close(() => {
    console.log("Closed out remaining connections");
    process.exit();
  });

  httpServer.close();

  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
}
