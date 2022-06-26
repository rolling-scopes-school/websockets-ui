import robot from 'robotjs';
import { WebSocket } from 'ws';
import { createClietCommand } from '../utils';
import constants from '../constants';

const left = (socket: WebSocket, param1: string) => {
  const { x, y } = robot.getMousePos();
  const width = Number(param1);

  robot.dragMouse(x - width, y);
  const command = constants.MOUSE_LEFT + ' ' + width + 'px';
  return socket.send(createClietCommand(command));
};

export default left;
