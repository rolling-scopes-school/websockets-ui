import { getMousePosition, mouseMove } from "./mouse";
import { getCircle } from "./circle";
import { getRectangle } from "./rectangle";

import { operations } from "../constants";
import { getPrintScreen } from "./printScreen";

const {
  mouseUp,
  mouseDown,
  mouseLeft,
  mouseRight,
  mousePosition,
  drawCircle,
  drawSquare,
  drawRectangle,
  printScreen,
} = operations;

export const chooseOperation = async (operation, args) => {
  let result;

  switch (operation) {
    case mouseUp:
    case mouseDown:
    case mouseLeft:
    case mouseRight:
      result = await mouseMove(operation, args);
      break;
    case mousePosition:
      result = await getMousePosition(operation, args);
      break;
    case drawCircle:
      result = getCircle(operation, args);
      break;
    case drawSquare:
    case drawRectangle:
      result = getRectangle(operation, args);
      break;
    case printScreen:
      result = getPrintScreen(operation, args);
      break;
    default:
      throw new Error("unknown operation");
  }

  return result;
};
