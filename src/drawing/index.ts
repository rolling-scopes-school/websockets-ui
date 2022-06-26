import robot from 'robotjs';
import { IMousePosition } from '../interfaces'

// Add speed for for slow drawing
const SPEED = 75;
let mouse: IMousePosition = robot.getMousePos();
// TODO: refactor drawSquare method using Promice + then
export const drawSquare = (x: number): void =>{
  mouse = robot.getMousePos();
  rightMouse(x);
  mouse = robot.getMousePos();
  downMouse(x);
  mouse = robot.getMousePos();
  leftMouse(x);
  mouse = robot.getMousePos();
  upMouse(x);
}

const rightMouse = (coord: number): void => {
  const { x } = mouse;

  for (let i = mouse.x; i < x + coord; i++) {
    robot.mouseClick();
    // robot.moveMouse(i, mouse.y);
    robot.moveMouseSmooth(i, mouse.y, SPEED);
  }
}

const downMouse = (coord: number): void => {
  const { x, y } = mouse;

  for (let i = y; i < y + coord; i++) {
    robot.mouseClick();
    // robot.moveMouse(x, i);
    robot.moveMouseSmooth(x, i, SPEED);
  }
}

const leftMouse = (coord: number): void => {
  const { x } = mouse;

  for (let i = mouse.x; i > x - coord; i--) {
    robot.mouseClick();
    // robot.moveMouse(i, mouse.y);
    robot.moveMouseSmooth(i, mouse.y, SPEED);
  }
}

const upMouse = (coord: number): void => {
  const { x, y } = mouse;

  for (let i = y; i > y - coord; i--) {
    robot.mouseClick();
    // robot.moveMouse(x, i);
    robot.moveMouseSmooth(x, i, SPEED);
  }
}

export const drawRectangle = (x: number, y: number): void =>{
  mouse = robot.getMousePos();
  rightMouse(x);
  mouse = robot.getMousePos();
  downMouse(y);
  mouse = robot.getMousePos();
  leftMouse(x);
  mouse = robot.getMousePos();
  upMouse(y);
 }

export const drawCircle = (radius: number) => {
  mouse = robot.getMousePos();

  for (let i = 0; i <= Math.PI * 2 + 0.1; i += 0.01) {
    const x = mouse.x + (radius * Math.cos(i));
    const y = mouse.y + (radius * Math.sin(i));
    robot.dragMouse(x, y);
    robot.mouseToggle('down');
  }
};
