import { ARGS_INDEX_FIRST } from '../../../shared/argsIndex';
import assertNotEmpty from '../../../shared/assert/assertNotEmpty';
import { SQUARE_ARGUMENTS_LENGTH } from './argumentsLength';
import AbstractDrawAction from './AbstractDrawAction';
import drawRectangle from './dratRectangle';

class SquareDrawAction extends AbstractDrawAction {
  protected x!: number;

  protected y!: number;

  protected width!: number;

  protected getArgsLength(): number {
    return SQUARE_ARGUMENTS_LENGTH;
  }

  protected override parseArgs(): void {
    const width = this.args[ARGS_INDEX_FIRST];

    assertNotEmpty(width);

    this.width = parseInt(width, 10);
  }

  protected override formatResponse(): string {
    return `draw_square ${this.width}`;
  }

  protected override draw = async (): Promise<void> => {
    await drawRectangle(this.width, this.width);
  };
}

export default SquareDrawAction;
