import { mouseMove } from "./mouseMove";

const operations = {
  mouseUp: "mouse_up",
  mouseDown: "mouse_down",
  mouseLeft: "mouse_left",
  mouseRight: "mouse_right",
};

const { mouseUp, mouseDown, mouseLeft, mouseRight } = operations;

export const chooseOperation = (operation, args) => {
  switch (operation) {
    case mouseUp:
      mouseMove(operation, args);
      break;
    case mouseDown:
      mouseMove(operation, args);
      break;
    case mouseLeft:
      mouseMove(operation, args);
      break;
    case mouseRight:
      mouseMove(operation, args);
      break;
  }
};
