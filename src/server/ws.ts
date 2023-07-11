import { messageHandler } from "./handler.js";

const wsHandler = (ws) => {
  console.log('Handshake complete :)');
  ws.on('message', (rawData) => {
    try {
      messageHandler(ws, rawData.toString());
    } catch (err) {
      console.log('We got a error:', err);
    }
  })

  ws.on('close', () => {
    console.log('WS connection is over :(');
    console.log('Shutting down WS...');
    ws.terminate();
  })
}

export { wsHandler };