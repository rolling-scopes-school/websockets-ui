import { mouse, up, down, left, right } from '@nut-tree/nut-js';
import { Command } from '../../enums';

export class MouseControlService {
  private responseMessage = '';

  async handleCommand(command: Command, value: number): Promise<void> {
    switch (command) {
      case Command.MOUSE_POSITION:
        const { x, y } = await mouse.getPosition();
        this.responseMessage = `${Command.MOUSE_POSITION} ${x},${y}`;
        break;
      case Command.MOUSE_UP:
        await mouse.move(up(value));
        break;
      case Command.MOUSE_DOWN:
        await mouse.move(down(value));
        break;
      case Command.MOUSE_LEFT:
        await mouse.move(left(value));
        break;
      case Command.MOUSE_RIGHT:
        await mouse.move(right(value));
        break;
    }
  }

  getResponseMessage(): string {
    return this.responseMessage;
  }
}
