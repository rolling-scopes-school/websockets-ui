import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 8000;

export const wss = new WebSocketServer(
  {
    port: PORT,
  },
  () => console.log(`Start websocket server started on the ${PORT} port!`),
);
