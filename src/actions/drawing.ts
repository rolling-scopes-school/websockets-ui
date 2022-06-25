import robot from 'robotjs';

export const drawCircle = (radius: number) => {
  const {x ,y} = robot.getMousePos();
  robot.mouseClick();
  robot.mouseToggle('down');
  for (let i = 0; i <= Math.PI * 2; i += 0.05) {
    const posX = x + (radius * Math.cos(i)) - radius + 1;
    const posY = y + (radius * Math.sin(i)) + 4;
    robot.moveMouse(posX, posY);
  }
  robot.mouseToggle('up');
};

export const drawSquare = (length: number) => {
  const {x, y} = robot.getMousePos();
  
  robot.mouseClick();
  robot.mouseToggle('down');
  robot.moveMouseSmooth(x + length, y, 3);
  robot.moveMouseSmooth(x + length, y + length, 3);
  robot.moveMouseSmooth(x, y + length, 3);
  robot.moveMouseSmooth(x, y, 3);
  robot.mouseToggle('up');
};

export const drawRectangle = (length: number, width: number) => {
  const {x, y} = robot.getMousePos();
  
  robot.mouseClick();
  robot.mouseToggle('down');
  robot.moveMouseSmooth(x + length, y, 3);
  robot.moveMouseSmooth(x + length, y + width, 3);
  robot.moveMouseSmooth(x, y + width, 3);
  robot.moveMouseSmooth(x, y, 3);
  robot.mouseToggle('up');
};

