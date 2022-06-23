import robot from 'robotjs';

export const drawRectangle = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  for (let i = 0; i <= width; i += width / 25) {
    robot.dragMouse(x + i, y);
  }
  for (let i = 0; i <= height; i += height / 25) {
    robot.dragMouse(x + width, y + i);
  }
  for (let i = 0; i <= width; i += width / 25) {
    robot.dragMouse(x + width - i, y + height);
  }
  for (let i = 0; i <= height; i += height / 25) {
    robot.dragMouse(x, y + height - i);
  }
  return true;
};
