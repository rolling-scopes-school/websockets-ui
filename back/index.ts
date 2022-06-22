import { WebSocketServer } from "ws";
import { handleMessages } from "./utils/handleMessages";
import "dotenv/config";

const PORT = Number(process.env.BACK_PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", function connection(ws) {
  console.log("Start websocket on the 8080 port");
  ws.on(
    "message",
    function message(data) {
      console.log("received: %s", data);
      handleMessages(data.toString(), ws);
    }
  );
});
