import robot from 'robotjs';
import type { IMousePosition } from '../interfaces';

let mouse: IMousePosition = robot.getMousePos();

export async function circle(radius: number) {
  mouse = robot.getMousePos();
  const xValues: number[] = [mouse.x];

  const yValues: number[] = [mouse.y];

  for (let i = 0; i < 360; i++) {
    xValues[i] = mouse.x + radius * Math.cos((2 * Math.PI * i) / 360);
    yValues[i] = mouse.y + radius * Math.sin((2 * Math.PI * i) / 360);
  }

  for (let i = 0; i < 360; i++) {
    const x: number | undefined = xValues[i];
    const y: number | undefined = yValues[i];
    if (x && y) {
      robot.dragMouse(x, y);
    }
  }
}

export async function square(x: number) {
  mouse = robot.getMousePos();
  rightMouse(x);
  mouse = { ...robot.getMousePos() };
  downMouse(x);
  mouse = { ...robot.getMousePos() };
  leftMouse(x);
  mouse = { ...robot.getMousePos() };
  upMouse(x);
  mouse = { ...robot.getMousePos() };
}

export async function rectangle(x: number, y: number) {
  mouse = robot.getMousePos();
  if (!y) y = x + 200;
  if (x === y) y += 100;
  if (x + 50 >= y) y += 50;
  rightMouse(x);
  mouse = { ...robot.getMousePos() };
  downMouse(y);
  mouse = { ...robot.getMousePos() };
  leftMouse(x);
  mouse = { ...robot.getMousePos() };
  upMouse(y);
  mouse = { ...robot.getMousePos() };
}

function rightMouse(movx: number): void {
  const { x } = mouse;

  for (let i = mouse.x; i < x + movx; i++) {
    if (i === x + movx) {
      break;
    }
    robot.moveMouse(i, mouse.y);
  }
}

function leftMouse(movx: number) {
  const { x } = mouse;

  for (let i = mouse.x; i > x - movx; i--) {
    if (i === x - movx) {
      break;
    }
    robot.moveMouse(i, mouse.y);
  }
}

function downMouse(movy: number): void {
  const { x, y } = mouse;

  for (let i = y; i < y + movy; i++) {
    if (i === y + movy) {
      break;
    }
    robot.moveMouse(x, i);
  }
}

function upMouse(movy: number): void {
  const { x, y } = mouse;

  for (let i = y; i > y - movy; i--) {
    if (i === y - movy) {
      break;
    }
    robot.moveMouse(x, i);
  }
}
