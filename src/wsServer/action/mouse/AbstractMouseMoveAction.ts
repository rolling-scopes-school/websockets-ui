import validateArgs from '../../command/commandArgsValidator';
import ActionInterface from '../ActionInterface';
import { ARGS_LENGTH_1 } from '../../../shared/argLength';
import { RADIX_10 } from '../../../shared/radix';
import { ARGS_INDEX_FIRST } from '../../../shared/argsIndex';
import assertNotEmpty from '../../../shared/assert/assertNotEmpty';

abstract class AbstractMouseMoveAction implements ActionInterface {
  private argsLength = ARGS_LENGTH_1;

  protected step!: number;

  protected mouseMoveType!: string;

  constructor(protected args: string[]) {}

  private validate = (): boolean => {
    return validateArgs(this.args, this.argsLength);
  };

  private formatResponse = (): string => `${this.mouseMoveType} ${this.step}`;

  protected processStep = (): void => {
    const step = this.args[ARGS_INDEX_FIRST];

    assertNotEmpty(step);

    this.step = parseInt(step, RADIX_10);
  };

  protected abstract setMouseMoveType(): void;

  protected abstract move(): Promise<void>;

  public execute = async (): Promise<string> => {
    this.validate();
    this.processStep();
    this.setMouseMoveType();

    await this.move();

    return this.formatResponse();
  };
}

export default AbstractMouseMoveAction;
