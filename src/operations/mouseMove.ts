import { mouse, down, left, right, up } from "@nut-tree/nut-js";

import { Operation, operations } from "../constants";

const getDirection = {
  [operations.mouseUp]: up,
  [operations.mouseDown]: down,
  [operations.mouseLeft]: left,
  [operations.mouseRight]: right,
};

export const mouseMove: Operation = async (name: string, args: string[]): Promise<string> => {
  const distance = +args[0];

  const direction = getDirection[name];

  await mouse.move(direction(distance));

  return `Mouse offset ${direction.name} by ${distance} px`;
};

export const getMousePosition: Operation = async (): Promise<string> => {
  const position = await mouse.getPosition();

  return `Mouse position is ${position.x},${position.y}`;
};
