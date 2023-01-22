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
        console.log(`received command: ${data}`);

        const { operation, args } = await parseIncomingData(data);

        chooseOperation(operation, args, webSocketStream);

        //  console.log(result);
      } catch (error: any) {
        console.log(`error: ${error.message}`);
      }
    });
  });
};
