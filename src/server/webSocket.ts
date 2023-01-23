import { createWebSocketStream, WebSocket, WebSocketServer } from "ws";

import { FG_CYAN, FG_YELLOW, MAX_OUTPUT_LENGTH } from "../constants";
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
        console.log(FG_YELLOW, `get operation: ${data}`);

        const { operation, args } = await parseIncomingData(data);

        let result = await chooseOperation(operation, args);

        webSocketStream._write(result);

        result =
          result.length > MAX_OUTPUT_LENGTH
            ? `${result.slice(0, MAX_OUTPUT_LENGTH - 2)}...`
            : result;
        console.log(FG_CYAN, `result: ${result.slice(0, 31)}`);
      } catch (error: any) {
        console.log(`error: ${error.message}`);
      }
    });
  });
};
