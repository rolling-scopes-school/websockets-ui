import { WebSocket } from "ws";
import { httpServer } from "./src/http_server/index.js";
const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const ws = new WebSocket;
let socket = new ws.Server ('ws://localhost:3000');

socket.onmessage = event => console.log(event.data);
socket.onerror = error => console.log(error);