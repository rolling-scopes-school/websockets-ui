export const operations = {
  mouseUp: "mouse_up",
  mouseDown: "mouse_down",
  mouseLeft: "mouse_left",
  mouseRight: "mouse_right",
  mousePosition: "mouse_position",
  drawCircle: "draw_circle",
  drawSquare: "draw_square",
  drawRectangle: "draw_rectangle",
  printScreen: "prnt_scrn",
};

export const CIRCLE_POINTS_COUNTS = 100;

export const FG_YELLOW = "\x1b[33m";
export const FG_CYAN = "\x1b[36m";

export const SCREENSHOT_SIZE = 200;

export const MAX_OUTPUT_LENGTH = 30;

export type Operation = (name: string, args: string[]) => Promise<string>;
