import { getMousePosition, mouseMove } from "./mouseMove";
import { getCircle } from "./circle";

import { operations } from "../constants";

const { mouseUp, mouseDown, mouseLeft, mouseRight, mousePosition, drawCircle } = operations;

export const chooseOperation = async (operation, args) => {
  let result;

  switch (operation) {
    case mouseUp:
      result = await mouseMove(operation, args);
      break;
    case mouseDown:
      result = await mouseMove(operation, args);
      break;
    case mouseLeft:
      result = await mouseMove(operation, args);
      break;
    case mouseRight:
      result = await mouseMove(operation, args);
      break;
    case mousePosition:
      result = await getMousePosition(operation, args);
      break;
    case drawCircle:
      getCircle(operation, args);
  }

  return result;
};
