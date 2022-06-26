import WebSocket, { createWebSocketStream, WebSocketServer } from "ws";
import { controller } from "./controller.js";

export function startWebsocketsServer(port: number) {
  const wss = new WebSocketServer({ port });
  wss.on("connection", function connection(ws: WebSocket.WebSocket) {
    const duplex = createWebSocketStream(ws, { encoding: "utf8", decodeStrings: false });
    duplex.on("data", async function message(data) {
      await controller(duplex, data.toString());
    });
  });

  process.on("SIGINT", shutDown);

  function shutDown() {
    console.log("Received kill signal, shutting down gracefully");
    wss.close(() => {
      console.log("Closed out remaining connections");
      process.exit();
    });

    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  }
  return wss;
}
