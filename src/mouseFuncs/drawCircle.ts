import robot from 'robotjs';
import { WebSocket } from 'ws';
import { createClietCommand } from '../utils';
import constants from '../constants';

const drawCircle = (socket: WebSocket, param1: string) => {
  const mousePos = robot.getMousePos();
  const radius = Number(param1);
  const drawingStep = 0.05;

  for (let i = 0; i <= Math.PI * 2; i += drawingStep) {
    const x = mousePos.x - radius + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);

    robot.dragMouse(x, y);
  }

  return socket.send(createClietCommand(constants.DRAW_CIRCLE));
};

export default drawCircle;
