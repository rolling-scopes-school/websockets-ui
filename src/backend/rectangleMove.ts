import { getMousePos, mouseToggle, dragMouse } from "robotjs";

export const rectangleMove = (x: number, y: number): void => {
  const mouse = getMousePos();

  mouseToggle("down");

  for (let i = 0; i < x; i += 1) {
    dragMouse(mouse.x + i, mouse.y);
  }

  for (let i = 0; i < y; i += 1) {
    dragMouse(mouse.x + x, mouse.y + i);
  }

  for (let i = 0; i < x; i += 1) {
    dragMouse(mouse.x + x - i, mouse.y + y);
  }

  for (let i = 0; i < y; i += 1) {
    dragMouse(mouse.x, mouse.y + y - i);
  }

  mouseToggle("up");
};
