import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import { Operation } from "../constants";

export const getRectangle: Operation = async (
  operation: string,
  args: string[],
): Promise<string> => {
  const width = +args[0];
  let height = +args[1] ? +args[1] : width;

  await mouse.drag(left(width));
  await mouse.drag(down(height));
  await mouse.drag(right(width));
  await mouse.drag(up(height));

  return +args[1] ? `${operation} ${width}px, ${height}px` : `${operation} ${width}px`;
};
