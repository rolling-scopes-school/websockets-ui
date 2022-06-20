import { drawFigure, Shapes } from "./commands/drawing.js";
import { Direction, moveMouse, getMousePosition } from "./commands/navigation.js";
import { printScreen } from "./commands/print-screen.js";

export const routes: Record<string, Function> = {
  mouse_up: async (distance: string) => moveMouse(Direction.UP, distance),
  mouse_down: async (distance: string) => moveMouse(Direction.DOWN, distance),
  mouse_left: async (distance: string) => moveMouse(Direction.LEFT, distance),
  mouse_right: async (distance: string) => moveMouse(Direction.RIGHT, distance),
  mouse_position: async () => getMousePosition(),

  draw_circle: async (shape: Shapes) => drawFigure(shape),
  draw_rectangle: async (shape: Shapes) => drawFigure(shape),
  draw_square: async (shape: Shapes) => drawFigure(shape),

  prnt_scrn: async () => printScreen(),
};
