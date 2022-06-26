import robot from 'robotjs';
import { WebSocket } from 'ws';
import { createClietCommand } from '../utils';
import constants from '../constants';

const up = (socket: WebSocket, param1: string) => {
  const { x, y } = robot.getMousePos();
  const height = Number(param1);

  robot.dragMouse(x, y - height);
  const command = constants.MOUSE_UP + ' ' + height + 'px';
  return socket.send(createClietCommand(command));
};

export default up;
