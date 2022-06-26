import robot from 'robotjs';
import { WebSocket } from 'ws';

const sendCoords = (ws: WebSocket) => {
  const { x, y } = robot.getMousePos();
  const msg: string = `mouse_position ${x}px,${y}px`;
  ws.send(msg);
};

export default sendCoords;
