import robot from 'robotjs';
import type { IMousePosition, IScreen } from '../interfaces';

const screen: IScreen = robot.getScreenSize();
let mouse: IMousePosition = robot.getMousePos();
export async function circle(radius: number) {
  console.log(screen);
  console.log(mouse);
  const upCord: number = mouse.y - radius;
  const downCord: number = mouse.y + radius;
  const rightCord: number = mouse.x + radius;
  const leftCord: number = mouse.x - radius;
  console.log(
    'up y =',
    upCord,
    ' , right x =',
    rightCord,
    ' , down y =',
    downCord,
    ' , left x =',
    leftCord
  );
}
export async function square(x: number, y: number) {
  if (x && y) {
    // SUCCESS
    if (x !== y) {
      y = x;
    }
    rightMouse(x);

    mouse = { ...robot.getMousePos() };

    downMouse(y);
    mouse = { ...robot.getMousePos() };
    leftMouse(y);
    mouse = { ...robot.getMousePos() };
    upMouse(y);
    mouse = { ...robot.getMousePos() };
  }
}

export async function rectangle(x: number, y?: number) {
  // SUCCESS
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
