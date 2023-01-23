import { Button, mouse, Point, straightTo } from "@nut-tree/nut-js";
import { Operation, COUNT_OF_CIRCLE_POINTS } from "../constants";

export const getCircle: Operation = async (_name: string, args: string[]): Promise<string> => {
  const radius = +args[0];

  const mousePosition = await mouse.getPosition();

  const centerOfCircle = { x: mousePosition.x, y: mousePosition.y + radius };

  await mouse.pressButton(Button.LEFT);

  for (let point = 0; point <= COUNT_OF_CIRCLE_POINTS; point += 1) {
    const x = centerOfCircle.x + radius * Math.sin((2 * Math.PI * point) / COUNT_OF_CIRCLE_POINTS);
    const y = centerOfCircle.y - radius * Math.cos((2 * Math.PI * point) / COUNT_OF_CIRCLE_POINTS);

    await mouse.move(straightTo(new Point(x, y)));
  }

  await mouse.releaseButton(Button.LEFT);

  return `draw_circle ${radius}px`;
};
