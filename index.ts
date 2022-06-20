import { httpServer } from "./src/http_server/index.js";
import WebSocket, { WebSocketServer } from "ws";
import { controller } from "./src/controller.js";

const HTTP_PORT = 3000;
const WS_PORT = 8080;

console.log(
  `Start static http server on the ${HTTP_PORT} port! http://localhost:${HTTP_PORT}`
);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", function connection(ws: WebSocket.WebSocket) {
  ws.on("message", async function message(data) {
    console.log("received: %s", data.toString());
    await controller(ws, data.toString());
  });
});

console.log(`Start WS server on the ${WS_PORT} port! http://localhost:${WS_PORT}`);
