import { createWebSocketStream, WebSocketServer } from "ws";
import { handleMessages } from "./utils/handleMessages";
import "dotenv/config";

const PORT = Number(process.env.BACK_PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", function connection(ws) {
  console.log(`Start websocket on the ${PORT} port!`);
  const stream = createWebSocketStream(ws, {
    encoding: "utf8",
    decodeStrings: false,
  });
  ws.on(
    "message",
    async function message() {
      const data = stream.read();
      console.log("received: %s", data);
      const newData = await handleMessages(data.toString());
      stream.write(newData);
    }
  );
});
