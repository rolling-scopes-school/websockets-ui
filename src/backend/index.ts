import { WebSocketServer } from "ws";
import { Port } from "../constant/index";
import { messageStream } from "./server";

export const readyBackend = () => {
  const webServer = new WebSocketServer({ port: Port.PORT });

  webServer.on("connection", messageStream);

  webServer.on("listening", () => {
    console.info(`Websocket server is running on port ${Port.PORT}`);
  });

  webServer.on("close", () => {
    console.log("WebSocket connection is closed");
  });
};
