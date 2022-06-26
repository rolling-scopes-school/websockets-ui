import { getMousePos, moveMouse } from "robotjs";

const mouse = getMousePos();

export const mouseMoveUp = (y: number): void => {
  moveMouse(mouse.x, mouse.y - y);
};

export const mouseMoveDown = (y: number): void => {
  moveMouse(mouse.x, mouse.y + y);
};

export const mouseMoveLeft = (x: number): void => {
  moveMouse(mouse.x - x, mouse.y);
};

export const mouseMoveRight = (x: number): void => {
  moveMouse(mouse.x + x, mouse.y);
};

export const mouseMovePosition = (): { x: number; y: number } => getMousePos();
