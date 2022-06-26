import { WebSocket, createWebSocketStream } from "ws";
import { Transform } from 'stream';

import { messageHandler } from "./messageHandler";

const onSocketConnection = (instant: WebSocket) => {
  const duplex = createWebSocketStream(instant, { encoding: 'utf8', decodeStrings: false });
  const transform = new Transform({
    transform: async (chunk, _, callback) => {
      const transformed = await messageHandler(chunk);
      callback(null, transformed)
    }
  })

  duplex.pipe(transform);
  transform.on('data', (data) => {
    instant.send(data.toString())
  })
}

export default onSocketConnection;