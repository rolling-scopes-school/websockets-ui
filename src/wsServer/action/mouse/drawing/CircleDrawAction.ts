import { Button, mouse, Point, straightTo } from '@nut-tree/nut-js';
import AbstractDrawAction from './AbstractDrawAction';
import { ARGS_LENGTH_1 } from '../../../../shared/argLength';
import { ARGS_INDEX_FIRST } from '../../../../shared/argsIndex';
import assertNotEmpty from '../../../../shared/assert/assertNotEmpty';

const CIRCLE_STEP = 1;

class CircleDrawAction extends AbstractDrawAction {
  protected radius!: number;

  protected x!: number;

  protected y!: number;

  protected getArgsLength(): number {
    return ARGS_LENGTH_1;
  }

  protected parseArgs(): void {
    const radius = this.args[ARGS_INDEX_FIRST];

    assertNotEmpty(radius);

    this.radius = parseInt(radius, 10);
  }

  protected async processCoordinates(): Promise<void> {
    const { x, y } = await mouse.getPosition();

    this.x = x;
    this.y = y;
  }

  protected override formatResponse(): string {
    return `draw_circle ${this.radius}`;
  }

  protected draw = async (): Promise<void> => {
    const { x, y, radius } = this;
    const centerX = x + radius;
    const centerY = y + radius;

    await mouse.pressButton(Button.LEFT);

    for (let i = 0; i <= 2 * Math.PI; i += CIRCLE_STEP) {
      const moveX = centerX - radius * Math.cos(i);
      const moveY = centerY - radius * Math.sin(i);

      await mouse.move(straightTo(new Point(moveX, moveY)));
    }

    await mouse.releaseButton(Button.LEFT);
  };
}

export default CircleDrawAction;
