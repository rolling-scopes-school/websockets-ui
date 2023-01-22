import { mouse, up, down, left, right, Point } from '@nut-tree/nut-js';
import { Command } from '../enums';
import { DrawService } from './services';
import { MouseControlService } from './services';

export class Commander {
  private responseMessage = '';

  getResponseMessage(): string {
    return this.responseMessage;
  }

  async handleCommand(
    command: Command,
    value: number,
    figureLength?: number
  ): Promise<void> {
    this.responseMessage = command;

    if (command.includes('mouse_')) {
      const mcService = new MouseControlService();
      await mcService.handleCommand(command, value);
      this.responseMessage =
        mcService.getResponseMessage() ?? this.responseMessage;
    } else if (command.includes('draw_')) {
      DrawService.draw(command, value, figureLength);
    }
  }
}
