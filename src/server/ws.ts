import { UserData } from "../db.js";
import { messageHandler } from "./handler.js";

const wsHandler = (wss, ws) => {
  const userData: UserData = {
    name: "",
    index: -1,
    roomIndex: -1,
    gameIndex: -1,
    ws: ws,
    wss: wss
  }
  console.log('Handshake complete :)');
  ws.on('message', (rawData) => {
    try {
      messageHandler(wss, ws, rawData.toString(), userData);
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