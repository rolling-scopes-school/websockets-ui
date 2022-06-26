import { getMousePos, mouseToggle, dragMouse } from "robotjs";

export const circleMove = (radius: number): void => {
  const mouse = getMousePos();

  mouseToggle("down");

  for (let i = 0; i < radius; i += 1) {
    const x = mouse.x + i;
    const y =
      -1 * Math.sqrt(radius ** 2 - (x - mouse.x) ** 2) + mouse.y + radius;
    dragMouse(x, y);
  }

  for (let i = 0; i < radius; i += 1) {
    const x = mouse.x + radius - i;
    const y = Math.sqrt(radius ** 2 - (x - mouse.x) ** 2) + mouse.y + radius;
    dragMouse(x, y);
  }

  for (let i = 0; i < radius; i += 1) {
    const x = mouse.x - i;
    const y = Math.sqrt(radius ** 2 - (x - mouse.x) ** 2) + mouse.y + radius;
    dragMouse(x, y);
  }

  for (let i = 0; i < radius; i += 1) {
    const x = mouse.x - radius + i;
    const y =
      -1 * Math.sqrt(radius ** 2 - (x - mouse.x) ** 2) + mouse.y + radius;
    dragMouse(x, y);
  }

  mouseToggle("up");
};
