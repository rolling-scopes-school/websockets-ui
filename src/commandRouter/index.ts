import { Duplex } from "node:stream";
import { NutAdaptor } from "../nutAdaptor";

export class CommandRouter {
  private commands = new Map<string, any>();

  private adaptor = new NutAdaptor();

  constructor() {
    this.register("mouse_position", this.adaptor.mousePosition);
    this.register("mouse_up", this.adaptor.mouseUp);
    this.register("mouse_down", this.adaptor.mouseDown);
    this.register("mouse_left", this.adaptor.mouseLeft);
    this.register("mouse_right", this.adaptor.mouseRight);
    this.register("draw_rectangle", this.adaptor.drawRectangle);
    this.register("draw_square", this.adaptor.drawSquare);
    this.register("draw_circle", this.adaptor.drawCircle);
    this.register("prnt_scrn", this.adaptor.printScreen);
  }

  private register(name: string, cmd: any): void {
    this.commands.set(name, cmd);
  }

  isExist(name: string): boolean {
    return this.commands.has(name) ? true : false;
  }

  async execute(
    name: string,
    wsStream: Duplex,
    ...args: string[]
  ): Promise<void> {
    await this.commands.get(name)(wsStream, ...args);
  }
}
