import { mouse, Point } from '@nut-tree/nut-js';
import { Command, Angle } from '../../enums';
import { getCirclePointCoords } from '../../helpers';

export class DrawService {
  static async draw(
    command: Command,
    value: number,
    figureLength?: number
  ): Promise<void> {
    const { x, y } = await mouse.getPosition();
    const startPoint = new Point(x, y);
    let points: Point[] = [startPoint];

    switch (command) {
      case Command.DRAW_CIRCLE: {
        const x0 = x;
        const y0 = y - value;

        for (let i = Angle.RIGHT; i !== Angle.FULL + Angle.RIGHT; i++) {
          const [x, y] = getCirclePointCoords(x0, y0, value, i);
          points.push(new Point(x, y));
        }

        break;
      }
      case Command.DRAW_RECT: {
        points = [
          new Point(x + value, y),
          new Point(x + value, y + figureLength!),
          new Point(x, y + figureLength!),
          startPoint
        ];

        break;
      }
      case Command.DRAW_SQUARE: {
        points = [
          new Point(x + value, y),
          new Point(x + value, y + value),
          new Point(x, y + value),
          startPoint
        ];

        break;
      }
    }

    await mouse.drag(points);
  }
}
