import { mouse, Point } from "@nut-tree/nut-js";
import { RADIAN_PER_DEGREE } from "../../const";
import { Command, Angle } from "../../enums";

export class DrawService {
    static async draw(command: Command, value: number, figureLength?: number): Promise<void> {
        const { x, y } = await mouse.getPosition();
        const startPoint = new Point(x, y);
        let points: Point[] = [];

        switch (command) {
            case Command.DRAW_CIRCLE: {
              const x0 = x;
              const y0 = y - value;
      
              points.push(startPoint);
      
              for (let i = Angle.RIGHT; i !== Angle.FULL + Angle.RIGHT; i++) {
                const x = x0 + value * Math.cos(i * RADIAN_PER_DEGREE);
                const y = y0 + value * Math.sin(i * RADIAN_PER_DEGREE);
      
                points.push(new Point(x, y));
              }

              break;
            }
            case Command.DRAW_RECT: {
              points = [
                startPoint,
                new Point(x + value, y),
                new Point(x + value, y + figureLength!),
                new Point(x, y + figureLength!),
                startPoint
              ];
      
              break;
            }
            case Command.DRAW_SQUARE: {
              points = [
                startPoint,
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