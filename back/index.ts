import { createWebSocketStream, WebSocketServer } from "ws";
import { handleMessages } from "./utils/handleMessages";
import "dotenv/config";
import { displayMessage } from "./utils/displayMessage";

const PORT = Number(process.env.BACK_PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", function connection(ws) {
  
  displayMessage(`Start websocket on the ${PORT} port!`);
  const stream = createWebSocketStream(ws, {
    encoding: "utf8",
    decodeStrings: false,
  });
  ws.on("message", async function message() {
    const data = stream.read();
    console.log("received: %s", data);
    const newData = await handleMessages(data.toString());
    stream.write(newData);
  });

  ws.on("close", () => {
    displayMessage("Websocket completed");
    process.exit(0);
  });
});

wss.on("close", () => {
  displayMessage("WebSocketServer completed");
  process.exit(0);
});
