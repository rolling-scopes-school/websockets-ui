import { Button, mouse, Point, straightTo } from '@nut-tree/nut-js';
import AbstractDrawAction from './AbstractDrawAction';
import { ARGS_INDEX_FIRST } from '../../../shared/argsIndex';
import assertNotEmpty from '../../../shared/assert/assertNotEmpty';
import { CIRCLE_END_POSITION } from './drawingConfig';
import { CIRCLE_ARGUMENTS_LENGTH } from './argumentsLength';
import { DRAW_CIRCLE_COMMAND_NAME } from './commandName';

class CircleDrawAction extends AbstractDrawAction {
  protected radius!: number;

  protected getArgsLength(): number {
    return CIRCLE_ARGUMENTS_LENGTH;
  }

  protected parseArgs(): void {
    const radius = this.args[ARGS_INDEX_FIRST];

    assertNotEmpty(radius);

    this.radius = parseInt(radius, 10);
  }

  protected override formatResponse(): string {
    return `${DRAW_CIRCLE_COMMAND_NAME} ${this.radius}`;
  }

  protected draw = async (): Promise<void> => {
    const { startX, startY, radius } = this;
    const centerX = startX + radius;
    const centerY = startY;
    const endPosition = CIRCLE_END_POSITION + this.step;

    await mouse.pressButton(Button.LEFT);

    for (let i = 0; i <= endPosition; i += this.step) {
      const moveX = centerX - radius * Math.cos(i);
      const moveY = centerY - radius * Math.sin(i);

      await mouse.move(straightTo(new Point(moveX, moveY)));
    }

    await mouse.releaseButton(Button.LEFT);
  };
}

export default CircleDrawAction;
