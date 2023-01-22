import { mouse, up, down, left, right } from '@nut-tree/nut-js';
import { Command } from '../../enums';

export class MouseControlService {
  private responseMessage = '';

  constructor(private command: Command, private value: number) {
    this.handleCommand();
  }

  async handleCommand(): Promise<void> {
    switch (this.command) {
      case Command.MOUSE_POSITION:
        const { x, y } = await mouse.getPosition();
        this.responseMessage = `${Command.MOUSE_POSITION} ${x},${y}`;
        break;
      case Command.MOUSE_UP:
        await mouse.move(up(this.value));
        break;
      case Command.MOUSE_DOWN:
        await mouse.move(down(this.value));
        break;
      case Command.MOUSE_LEFT:
        await mouse.move(left(this.value));
        break;
      case Command.MOUSE_RIGHT:
        await mouse.move(right(this.value));
        break;
    }
  }

  getResponseMessage(): string {
    return this.responseMessage;
  }
}
