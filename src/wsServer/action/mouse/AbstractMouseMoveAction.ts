import parseStep from '../../parser/stepParser';
import validateArgs from '../../command/commandArgsValidator';
import ActionInterface from '../ActionInterface';

abstract class AbstractMouseMoveAction implements ActionInterface {
  private MOUSE_ARGS_LENGTH = 1;

  protected step!: number;

  protected mouseMoveType!: string;

  constructor(protected args: string[]) {}

  private validate = (): boolean => {
    return validateArgs(this.args, this.MOUSE_ARGS_LENGTH);
  };

  private formatResponse = (): string => `${this.mouseMoveType} ${this.step}`;

  protected processStep = (): void => {
    this.step = parseStep(this.args);
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
