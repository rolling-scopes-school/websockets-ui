import {httpServer} from './task/server'
import WebSocket from "ws";
import { onConnect } from './task/websocket';

console.warn(`Start static http server on the 3000 port!`);
httpServer.listen(3000);

const wsServer = new WebSocket.Server({ port: 8080 }, () => console.warn(`WebSocket start on 8080 port`));

wsServer.on("connection", onConnect);



