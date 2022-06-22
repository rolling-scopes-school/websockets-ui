import { WebSocketServer } from "ws";
import { handleMessages } from "./utils/handleMessages";
import "dotenv/config";

const PORT = Number(process.env.BACK_PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", function connection(ws) {
  console.log(`Start websocket on the ${PORT} port!`);
  ws.on(
    "message",
    function message(data) {
      console.log("received: %s", data);
      handleMessages(data.toString(), ws);
    }
  );
});

// https://github.com/websockets/ws
// import WebSocket, { createWebSocketStream } from "ws";

// const ws = new WebSocket("wss://websocket-echo.com/");

// const duplex = createWebSocketStream(ws, { encoding: "utf8" });

// duplex.pipe(process.stdout);
// process.stdin.pipe(duplex);