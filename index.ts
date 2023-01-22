import { httpServer } from "./src/http_server/index";
// import { wsserver } from './src/ws';
import { mouse } from "@nut-tree/nut-js";
import { WebSocketServer } from "ws";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
export const wsserver  = new WebSocketServer({ port: 8080 });

if(wsserver) {
  console.log('server');
} else {
  console.log('not exist');
}

wsserver.on('connection', (ws) => {
  console.log('connection!');
  ws.on('message', (data) => {
    console.log('received: %s', data);
  });

  ws.send('something');
});


