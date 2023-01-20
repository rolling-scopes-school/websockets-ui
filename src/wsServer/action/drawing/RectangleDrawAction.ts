import { Button, down, left, mouse, Point, right, up } from '@nut-tree/nut-js';
import AbstractDrawAction from './AbstractDrawAction';
import { ARGS_INDEX_FIRST, ARGS_INDEX_SECOND } from '../../../shared/argsIndex';
import assertNotEmpty from '../../../shared/assert/assertNotEmpty';

class RectangleDrawAction extends AbstractDrawAction {
  protected x!: number;

  protected y!: number;

  protected width!: number;

  protected length!: number;

  protected getArgsLength(): number {
    return 2;
  }

  protected parseArgs(): void {
    const width = this.args[ARGS_INDEX_FIRST];
    const length = this.args[ARGS_INDEX_SECOND];

    assertNotEmpty(width);
    assertNotEmpty(length);

    this.width = parseInt(width, 10);
    this.length = parseInt(length, 10);
  }

  protected formatResponse(): string {
    return `draw_rectangle ${this.width} ${this.length}`;
  }

  protected drawLine = async (destination: Point[]): Promise<void> => {
    await mouse.pressButton(Button.LEFT);

    await mouse.move(destination);

    await mouse.releaseButton(Button.LEFT);
  };

  protected drawRectangle = async (): Promise<void> => {
    await this.drawLine(await down(this.width));
    await this.drawLine(await right(this.length));
    await this.drawLine(await up(this.width));
    await this.drawLine(await left(this.length));
  };

  protected draw = async (): Promise<void> => {
    await this.drawRectangle();
  };
}

export default RectangleDrawAction;
