import robot from 'robotjs';
import { WebSocket } from 'ws';

const up = (socket: WebSocket, param1: string) => {
  const { x, y } = robot.getMousePos();
  const height = Number(param1);

  robot.dragMouse(x, y - height);

  return socket.send('mouse_up ${height}px\0');
};

export default up;
