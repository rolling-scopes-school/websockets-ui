import {WebSocketServer} from "ws";
import { httpServer } from "./src/http_server/index";


const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
const ws = new WebSocketServer({port: 8080})

ws.on("connection", (socket) => {
    
})