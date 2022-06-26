import robot from 'robotjs';
import type { IMousePosition } from '../interfaces';

export function rightMouse(movx: number, mouse: IMousePosition): void {
  const { x } = mouse;

  for (let i = mouse.x; i < x + movx; i++) {
    if (i === x + movx) {
      break;
    }
    robot.moveMouse(i, mouse.y);
  }
}

export function leftMouse(movx: number, mouse: IMousePosition) {
  const { x } = mouse;

  for (let i = mouse.x; i > x - movx; i--) {
    if (i === x - movx) {
      break;
    }
    robot.moveMouse(i, mouse.y);
  }
}

export function downMouse(movy: number, mouse: IMousePosition): void {
  const { x, y } = mouse;

  for (let i = y; i < y + movy; i++) {
    if (i === y + movy) {
      break;
    }
    robot.moveMouse(x, i);
  }
}

export function upMouse(movy: number, mouse: IMousePosition): void {
  const { x, y } = mouse;

  for (let i = y; i > y - movy; i--) {
    if (i === y - movy) {
      break;
    }
    robot.moveMouse(x, i);
  }
}
