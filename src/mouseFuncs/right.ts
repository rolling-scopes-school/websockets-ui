import robot from 'robotjs';
import { WebSocket } from 'ws';

const right = (socket: WebSocket, param1: string) => {
  const { x, y } = robot.getMousePos();
  const width = Number(param1);

  robot.dragMouse(x + width, y);

  return socket.send('mouse_right ${height}px\0');
};

export default right;
