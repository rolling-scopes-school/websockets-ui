import { mouse, up, down, left, right, Point } from '@nut-tree/nut-js';
import { RADIAN_PER_DEGREE } from '../const';
import { Angle, Command } from '../enums';

export class Commander {
  private responseMessage = '';

  constructor(private command: Command, private value: number) {
    this.handleCommand();
  }

  getResponseMessage(): string {
    return this.responseMessage;
  }

  private async handleCommand(): Promise<void> {
    this.responseMessage = this.command;

    switch (this.command) {
      case Command.MOUSE_POSITION: {
        const { x, y } = await mouse.getPosition();
        this.responseMessage = `${Command.MOUSE_POSITION} ${x},${y}`;
        break;
      }
      case Command.MOUSE_UP:
        await mouse.move(up(this.value));
        break;
      case Command.MOUSE_DOWN:
        await mouse.move(down(this.value));
        break;
      case Command.MOUSE_LEFT:
        await mouse.move(left(this.value));
        break;
      case Command.MOUSE_RIGHT:
        await mouse.move(right(this.value));
        break;
      case Command.DRAW_CIRCLE: {
        const { x: x0, y } = await mouse.getPosition();
        const points = [];
        const y0 = y - this.value;

        points.push(new Point(x0, y));

        for (let i = Angle.RIGHT; i !== Angle.FULL + Angle.RIGHT; i++) {
          const x = x0 + this.value * Math.cos(i * RADIAN_PER_DEGREE);
          const y = y0 + this.value * Math.sin(i * RADIAN_PER_DEGREE);

          points.push(new Point(x, y));
        }

        await mouse.drag(points);
        break;
      }
    }
  }
}
