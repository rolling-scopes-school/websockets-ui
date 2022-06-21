import { WebSocketServer } from "ws";
// import Jimp from 'jimp';
// import robot from 'robotjs';
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  setInterval(() => ws.send("something"),2000);
  
});
