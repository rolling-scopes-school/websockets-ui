import { DuplexOptions } from "stream";
import { WebSocketServer, createWebSocketStream, WebSocket } from "ws";
import { CommandRouter } from "../commandRouter/commandRouter";

const wsStreamOptions: DuplexOptions = {
  decodeStrings: false,
  encoding: "utf8",
};

export const wsServer = (port = 8080): WebSocketServer => {
  const wss = new WebSocketServer({ port });
  const commandRouter = new CommandRouter();

  wss.on("connection", async (webSocket: WebSocket) => {
    const wsStream = createWebSocketStream(webSocket, wsStreamOptions);

    wsStream.on("data", async (data: string = "") => {
      try {
        if (data === "") {
          throw new Error("Empty command received.");
        }
        console.log(`<- ${data}`);
        const [cmd, ...args] = data.split(" ");
        if (commandRouter.isExist(cmd)) {
          commandRouter.execute(cmd, wsStream, ...args);
        } else {
          throw new Error(`Command ${cmd} doesn't exist.`);
        }
      } catch (error: any) {
        console.log(`:: Got error: ${error.message}`);
      }
    });
  });
  return wss;
};
