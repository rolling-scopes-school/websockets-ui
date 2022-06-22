import { WebSocketServer } from "ws";
import { handleMessages } from "./utils/handleMessages";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("Start websocket on the 8080 port");
  ws.on(
    "message",
    function message(data) {
      console.log("received: %s", data);
      const dataString = data.toString();
      handleMessages(dataString, ws);
    }
  );
});
