import { mouse } from '@nut-tree/nut-js';
import ActionInterface from '../ActionInterface';
import validateArgs from '../../command/commandArgsValidator';
import { DEFAULT_DRAWING_STEP } from './drawingConfig';

abstract class AbstractDrawAction implements ActionInterface {
  protected step = DEFAULT_DRAWING_STEP;

  protected startX!: number;

  protected startY!: number;

  constructor(protected args: string[]) {}

  protected abstract getArgsLength(): number;

  protected abstract parseArgs(): void;

  protected abstract formatResponse(): string;

  protected abstract draw(): Promise<void>;

  private validate = (): boolean => {
    return validateArgs(this.args, this.getArgsLength());
  };

  protected async processStartPosition(): Promise<void> {
    const { x, y } = await mouse.getPosition();

    this.startX = x;
    this.startY = y;
  }

  public execute = async (): Promise<string> => {
    this.validate();
    this.parseArgs();

    await this.processStartPosition();

    await this.draw();

    return this.formatResponse();
  };
}

export default AbstractDrawAction;
