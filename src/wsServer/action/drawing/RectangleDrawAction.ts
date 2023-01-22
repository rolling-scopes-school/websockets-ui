import AbstractDrawAction from './AbstractDrawAction';
import { ARGS_INDEX_FIRST, ARGS_INDEX_SECOND } from '../../../shared/argsIndex';
import assertNotEmpty from '../../../shared/assert/assertNotEmpty';
import { RECTANGLE_ARGUMENTS_LENGTH } from './argumentsLength';
import drawRectangle from './dratRectangle';
import { DRAW_RECTANGLE_COMMAND_NAME } from './commandName';

class RectangleDrawAction extends AbstractDrawAction {
  protected x!: number;

  protected y!: number;

  protected width!: number;

  protected length!: number;

  protected getArgsLength(): number {
    return RECTANGLE_ARGUMENTS_LENGTH;
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
    return `${DRAW_RECTANGLE_COMMAND_NAME} ${this.width} ${this.length}`;
  }

  protected draw = async (): Promise<void> => {
    await drawRectangle(this.width, this.length);
  };
}

export default RectangleDrawAction;
