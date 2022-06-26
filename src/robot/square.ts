import robot from 'robotjs';
import { downMouse, leftMouse, rightMouse, upMouse } from './mouse';
import type { IMousePosition } from '../interfaces';

export default async function square(x: number) {
  let mouse: IMousePosition;

  mouse = robot.getMousePos();
  rightMouse(x, mouse);
  mouse = { ...robot.getMousePos() };
  downMouse(x, mouse);
  mouse = { ...robot.getMousePos() };
  leftMouse(x, mouse);
  mouse = { ...robot.getMousePos() };
  upMouse(x, mouse);
  mouse = { ...robot.getMousePos() };
  return mouse;
}
