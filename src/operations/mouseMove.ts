import { mouse, down, left, right, up } from "@nut-tree/nut-js";
import { Operation, operations } from "../constants";
import { easingFunction } from "../helpers/index";

const getDirection = {
  [operations.mouseUp]: up,
  [operations.mouseDown]: down,
  [operations.mouseLeft]: left,
  [operations.mouseRight]: right,
};

const mouseMove: Operation = async (name: string, args: string[]): Promise<string> => {
  // const distanceInPx = parseInt(args[0]!, 10);
  const distance = +args[0];

  const direction = getDirection[name];

  await mouse.move(direction(distance), easingFunction);

  return `Mouse offset ${direction.name} by ${distance} px`;
};

export { mouseMove };
