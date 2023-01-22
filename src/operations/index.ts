import { getMousePosition, mouseMove } from "./mouseMove";

import { operations } from "../constants";

const { mouseUp, mouseDown, mouseLeft, mouseRight, mousePosition } = operations;

export const chooseOperation = async (operation, args, webSocketStream) => {
  switch (operation) {
    case mouseUp:
      mouseMove(operation, args, webSocketStream);
      break;
    case mouseDown:
      mouseMove(operation, args, webSocketStream);
      break;
    case mouseLeft:
      mouseMove(operation, args, webSocketStream);
      break;
    case mouseRight:
      mouseMove(operation, args, webSocketStream);
      break;
    case mousePosition:
      const result = await getMousePosition(operation, args, webSocketStream);
      console.log(result);
      webSocketStream._write(result);
      break;
  }
};
