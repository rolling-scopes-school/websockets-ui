import { Duplex } from "stream";

export const operations = {
  mouseUp: "mouse_up",
  mouseDown: "mouse_down",
  mouseLeft: "mouse_left",
  mouseRight: "mouse_right",
  mousePosition: "mouse_position",
};

export type Operation = (name: string, args: string[], webSocket: Duplex) => Promise<string>;
