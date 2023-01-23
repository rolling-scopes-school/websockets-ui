import { Button, mouse, Point, straightTo } from "@nut-tree/nut-js";
import { Operation, CIRCLE_POINTS_COUNTS } from "../constants";

export const getCircle: Operation = async (operation: string, args: string[]): Promise<string> => {
  const radius = +args[0];

  const mousePosition = await mouse.getPosition();

  const center = { x: mousePosition.x, y: mousePosition.y + radius };

  await mouse.pressButton(Button.LEFT);

  for (let point = 0; point <= CIRCLE_POINTS_COUNTS; point += 1) {
    const x = center.x + radius * Math.sin((2 * Math.PI * point) / CIRCLE_POINTS_COUNTS);
    const y = center.y - radius * Math.cos((2 * Math.PI * point) / CIRCLE_POINTS_COUNTS);

    await mouse.move(straightTo(new Point(x, y)));
  }

  await mouse.releaseButton(Button.LEFT);

  return `${operation} ${radius}px`;
};
