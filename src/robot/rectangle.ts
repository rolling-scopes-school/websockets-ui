import robot from 'robotjs';
import { downMouse, leftMouse, rightMouse, upMouse } from './mouse';
import type { IMousePosition } from '../interfaces';

export default async function rectangle(x: number, y: number) {
  let mouse: IMousePosition = robot.getMousePos();
  if (!y) y = x + 200;
  if (x === y) y += 100;
  if (x + 50 >= y) y += 50;
  rightMouse(x, mouse);
  mouse = { ...robot.getMousePos() };
  downMouse(y, mouse);
  mouse = { ...robot.getMousePos() };
  leftMouse(x, mouse);
  mouse = { ...robot.getMousePos() };
  upMouse(y, mouse);
  mouse = { ...robot.getMousePos() };
  return mouse;
}
