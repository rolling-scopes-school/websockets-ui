import {
  mouse,
  up,
  down,
  left,
  right,
  Point,
  Region,
  screen
} from '@nut-tree/nut-js';
import Jimp from 'jimp';

import { Command } from '../enums';
import { DrawService } from './services';
import { MouseControlService } from './services';
import { PrntScrnService } from './services/prnt-scrn';

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
    } else {
      const mousePosition = await MouseControlService.getMousePosition();
      const prntScrnBase64 = await PrntScrnService.getPrntScrnBase64(
        mousePosition
      );
      this.responseMessage = `${command} ${prntScrnBase64}`;
    }
  }
}
