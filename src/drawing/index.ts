import robot from 'robotjs';
// import fs from 'fs';
// import Jimp from 'jimp';

interface IMousePosition{
  x: number, y: number 
}
// Add speed for for slow drawing
const SPEED = 75;
let mouse: IMousePosition = robot.getMousePos();

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