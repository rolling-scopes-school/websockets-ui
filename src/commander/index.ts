import { Command } from '../enums';
import { DrawService } from './services';
import { MouseControlService } from './services';
import { PrntScrnService } from './services';

export class Commander {
  private responseMessage = '';

  constructor(private mcService = new MouseControlService()) {}

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
      await this.mcService.handleCommand(command, value);
      this.responseMessage =
        this.mcService.getResponseMessage() ?? this.responseMessage;
    } else if (command.includes('draw_')) {
      DrawService.draw(command, value, figureLength);
    } else {
      const mousePosition = await MouseControlService.getMousePosition();
      const prntScrnBase64 = await PrntScrnService.getPrntScrnBase64(
        mousePosition
      );
      this.responseMessage = `${command} ${prntScrnBase64}`;
    }
  }
}
