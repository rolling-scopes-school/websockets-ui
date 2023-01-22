import { mouse, up, down, left, right, Point } from '@nut-tree/nut-js';
import { Command } from '../enums';
import { DrawService } from './services';
import { MouseControlService } from './services';

export class Commander {
  private responseMessage = '';

  constructor(private command: Command, private value: number, private figureLength?: number) {
    this.handleCommand();
  }

  async getResponseMessage(): Promise<string> {
    return this.responseMessage;
  }

  private async handleCommand(): Promise<void> {
    this.responseMessage = this.command;

    if (this.command.includes('mouse_')) {
      const mcService = new MouseControlService(this.command, this.value);
      this.responseMessage = mcService.getResponseMessage() ?? this.responseMessage;
    } else if (this.command.includes('draw_')) {
      DrawService.draw(this.command, this.value, this.figureLength);
    }
  }
}
