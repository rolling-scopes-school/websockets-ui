import robot from 'robotjs';
import { WebSocket } from 'ws';

const down = (socket: WebSocket, param1: string) => {
  const { x, y } = robot.getMousePos();
  const height = Number(param1);

  robot.dragMouse(x, y + height);

  return socket.send('mouse_down ${height}px\0');
};

export default down;
