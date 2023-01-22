export const operations = {
  mouseUp: "mouse_up",
  mouseDown: "mouse_down",
  mouseLeft: "mouse_left",
  mouseRight: "mouse_right",
};

export type Operation = (name: string, args: string[]) => Promise<string>;
