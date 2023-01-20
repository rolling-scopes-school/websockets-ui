import ActionInterface from '../../ActionInterface';
import validateArgs from '../../../command/commandArgsValidator';

abstract class AbstractDrawAction implements ActionInterface {
  constructor(protected args: string[]) {}

  protected abstract getArgsLength(): number;

  protected abstract parseArgs(): void;

  protected abstract formatResponse(): string;

  protected abstract processCoordinates(): void;

  protected abstract draw(): Promise<void>;

  private validate = (): boolean => {
    return validateArgs(this.args, this.getArgsLength());
  };

  public execute = async (): Promise<string> => {
    this.validate();
    this.parseArgs();

    await this.draw();

    return this.formatResponse();
  };
}

export default AbstractDrawAction;
