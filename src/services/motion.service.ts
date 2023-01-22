import { mouse } from '@nut-tree/nut-js';

const getMousePosition = async () => {
  return await mouse.getPosition();
};

const moveMouse = async (x: number, y: number) => {
  const { x: currentX, y: currentY } = await getMousePosition();

  mouse.setPosition({
    x: currentX + x,
    y: currentY + y,
  });
};

const drawCircle = async (radius: number) => {};

const drawRectangle = async (width: number, height: number = width) => {};

const printScreen = async () => {};

export default {
  moveMouse,
  getMousePosition,
  drawCircle,
  drawRectangle,
  printScreen,
};
