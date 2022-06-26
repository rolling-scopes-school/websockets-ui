import robot from 'robotjs';
import { WebSocket } from 'ws';
import { createClietCommand } from '../utils';
import constants from '../constants';

const drawSquare = (socket: WebSocket, param1: string) => {
  const width = Number(param1);
  const height = Number(param1);
  const drawingStep = 2;

  const mousePosBefoWidth = robot.getMousePos();
  for (let i = 0; i <= width; i += drawingStep) {
    const x = mousePosBefoWidth.x;
    const y = mousePosBefoWidth.y + i;

    robot.dragMouse(x, y);
  }

  const mousePosAfterWidth = robot.getMousePos();
  for (let i = 0; i <= height; i += drawingStep) {
    const x = mousePosAfterWidth.x + i;
    const y = mousePosAfterWidth.y;

    robot.dragMouse(x, y);
  }

  const mousePosBefoheigth = robot.getMousePos();
  for (let i = 0; i <= width; i += drawingStep) {
    const x = mousePosBefoheigth.x;
    const y = mousePosBefoheigth.y - i;

    robot.dragMouse(x, y);
  }

  const mousePosAfterHeight = robot.getMousePos();
  for (let i = 0; i <= height; i += drawingStep) {
    const x = mousePosAfterHeight.x - i;
    const y = mousePosAfterHeight.y;

    robot.dragMouse(x, y);
  }
  socket.send(createClietCommand(constants.DRAW_SQAURE));
};

export default drawSquare;
