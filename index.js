import { httpServer } from "./src/http_server/index.js";
import { mouse } from "@nut-tree/nut-js";
import { createServer } from "http";
import * as WebSocket from "ws";
import { WebSocketServer } from "ws";
import { createWebSocketStream } from "ws";

const HTTP_PORT = 8181;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});

const server = createServer((req, res) => {
  console.log(req.url);
  if (req.method === "GET" && req.url === "/healthcheck") {
    res.end("OK!");
    return;
  }
});

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  // TODO: display webSocket params
  console.log("A new client Connected!");
  const duplex = createWebSocketStream(ws, { encoding: "utf8" });
  // duplex.write("Welcome New Client!"); ??
  ws.send("Welcome New Client!");
  duplex.on("data", (command) => {
    console.log("received: %s", command);
    if (command.startsWith("mouse_up")) {
      //TODO: nut-js moves mouse up
      const msgToSendBack = command.split(" ").join("");
      // duplex.write(msgToSendBack, "utf-8", (err) => {
      //   if (err) {
      //     console.log("Oops, something went wrong");
      //   }
      console.log(`send: ${command.slice(0, 8)} on${command.slice(8)} px \n`);
      // });
    }
  });
});

server.listen(8080, () => {
  console.log("server started on port 8080");
});
