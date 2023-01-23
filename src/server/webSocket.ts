import { createWebSocketStream, WebSocket, WebSocketServer } from "ws";
import { parseIncomingData } from "../helpers";
import { chooseOperation } from "../operations";

export const webSocketServer = (port: number | string) => {
  const server = new WebSocketServer({ port });

  server.on("connection", async (webSocket: WebSocket) => {
    const webSocketStream = createWebSocketStream(webSocket, {
      encoding: "utf8",
    });

    webSocketStream.on("data", async (data: string) => {
      try {
        console.log(`get command: ${data}`);

        const { operation, args } = await parseIncomingData(data);

        const result = await chooseOperation(operation, args);

        // webSocketStream._write(result);

        console.log(`result: ${result}`);
      } catch (error: any) {
        console.log(`error: ${error.message}`);
      }
    });
  });
};
