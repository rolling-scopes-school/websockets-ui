import robot from 'robotjs';

export const drawRectangle = (width: number, length?: string) => {
  const { x: x1, y: y1 } = robot.getMousePos();
  const x2 = x1 + (length ? parseFloat(length) : width);
  const y2 = y1 + width;

  robot.mouseToggle('down');
  robot.moveMouseSmooth(x2, y1);
  robot.moveMouseSmooth(x2, y2);
  robot.moveMouseSmooth(x1, y2);
  robot.moveMouseSmooth(x1, y1);
  robot.mouseToggle('up');
};

export const drawCircle = (radius: number) => {
  const { x: x1, y: y1 } = robot.getMousePos();

  robot.moveMouse(x1 + radius, y1);
  robot.mouseToggle('down');

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    robot.moveMouseSmooth(x1 + radius * Math.cos(i), y1 + radius * Math.sin(i));
  }

  robot.mouseToggle('up');
  robot.moveMouse(x1, y1);
};
