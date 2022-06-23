import { drawCircle, drawRectangle, drawSquare } from "./commands/drawing.js";
import { Direction, moveMouse, getMousePosition } from "./commands/navigation.js";
import { printScreen } from "./commands/print-screen.js";

export const routes: Record<string, Function> = {
  mouse_up: (distance: string) => moveMouse(Direction.UP, Number(distance)),
  mouse_down: (distance: string) => moveMouse(Direction.DOWN, Number(distance)),
  mouse_left: (distance: string) => moveMouse(Direction.LEFT, Number(distance)),
  mouse_right: (distance: string) => moveMouse(Direction.RIGHT, Number(distance)),
  mouse_position: () => getMousePosition(),

  draw_circle: (radius: string) => drawCircle(Number(radius)),
  draw_rectangle: (length: string, width: string) =>
    drawRectangle(Number(length), Number(width)),
  draw_square: (length: string) => drawSquare(Number(length)),

  prnt_scrn: () => printScreen(),
};
