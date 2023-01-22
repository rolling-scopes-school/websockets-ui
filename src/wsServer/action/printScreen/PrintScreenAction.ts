import { mouse, Region, screen } from '@nut-tree/nut-js';
import Jimp from 'jimp';
import ActionInterface from '../ActionInterface';
import {
  BUFFER_ENCODING,
  PRINT_SCREEN_HALF_HEIGHT,
  PRINT_SCREEN_HALF_WIDTH,
  PRINT_SCREEN_HEIGHT,
  PRINT_SCREEN_WIDTH,
} from './printScreenConfig';
import PRINT_SCREEN_COMMAND_NAME from './commandName';
import log from '../../../shared/logger';

class PrintScreenAction implements ActionInterface {
  protected left!: number;

  protected top!: number;

  protected width!: number;

  protected height!: number;

  protected async processConfiguration(): Promise<void> {
    const { x, y } = await mouse.getPosition();

    log(`print-screen cursor position: x: ${x}, y: ${y}`);

    this.left = x - PRINT_SCREEN_HALF_WIDTH;
    this.left = Math.max(0, this.left);

    this.top = y - PRINT_SCREEN_HALF_HEIGHT;
    this.top = Math.max(0, this.top);

    const screenWidth = await screen.width();
    const screenHeight = await screen.height();

    const right = this.left + PRINT_SCREEN_WIDTH;
    const bottom = this.top + PRINT_SCREEN_HEIGHT;

    this.width =
      right > screenWidth ? screenWidth - this.left : PRINT_SCREEN_WIDTH;
    this.height =
      bottom > screenHeight ? screenHeight - this.top : PRINT_SCREEN_HEIGHT;
  }

  protected async printScreen(): Promise<string> {
    const printScreenRegion = new Region(
      this.left,
      this.top,
      this.width,
      this.height,
    );

    await screen.highlight(printScreenRegion);

    const grabbedRegionImage = await screen.grabRegion(printScreenRegion);

    const grabbedRGB = await grabbedRegionImage.toRGB();
    const jimpImage = new Jimp({
      data: grabbedRGB.data,
      width: grabbedRGB.width,
      height: grabbedRGB.height,
    });
    const imageBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);
    const imageBufferBase64 = imageBuffer.toString(BUFFER_ENCODING);

    return imageBufferBase64;
  }

  public static formatResponse(imageBuffer: string): string {
    return `${PRINT_SCREEN_COMMAND_NAME} ${imageBuffer}`;
  }

  public execute = async (): Promise<string> => {
    await this.processConfiguration();

    const imageBuffer = await this.printScreen();

    return PrintScreenAction.formatResponse(imageBuffer);
  };
}

export default PrintScreenAction;
