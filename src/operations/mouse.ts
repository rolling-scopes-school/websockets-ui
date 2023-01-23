import { mouse, down, left, right, up } from "@nut-tree/nut-js";

import { Operation, operations } from "../constants";

const getDirection = {
  [operations.mouseUp]: up,
  [operations.mouseDown]: down,
  [operations.mouseLeft]: left,
  [operations.mouseRight]: right,
};

export const mouseMove: Operation = async (operation: string, args: string[]): Promise<string> => {
  const distance = +args[0];

  const direction = getDirection[operation];

  await mouse.move(direction(distance));

  return `${operation} ${distance}px`;
};

export const getMousePosition: Operation = async (operation: string): Promise<string> => {
  const position = await mouse.getPosition();

  return `${operation} ${position.x}px,${position.y}px`;
};
