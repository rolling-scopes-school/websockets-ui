export const operations = {
  mouseUp: "mouse_up",
  mouseDown: "mouse_down",
  mouseLeft: "mouse_left",
  mouseRight: "mouse_right",
  mousePosition: "mouse_position",
  drawCircle: "draw_circle",
};

export const COUNT_OF_CIRCLE_POINTS = 100;

export type Operation = (name: string, args: string[]) => Promise<string>;
