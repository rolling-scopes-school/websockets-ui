import { DuplexOptions } from "stream";
import { WebSocketServer, createWebSocketStream, WebSocket } from "ws";

const wsStreamOptions: DuplexOptions = {
  decodeStrings: false,
  encoding: "utf8",
};

export const wsServer = (port = 8080): WebSocketServer => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", async (webSocket: WebSocket) => {
    const wsStream = createWebSocketStream(webSocket, wsStreamOptions);

    wsStream.on("data", async (data: string) => {
      try {
        console.log(`wsStream data: ${data}`);
      } catch (error: any) {
        console.log(`wsStream error: ${error.message}`);
      }
    });
  });
  return wss;
};
