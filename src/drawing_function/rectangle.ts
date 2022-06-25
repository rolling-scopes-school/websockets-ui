import robot from 'robotjs';

export const drawRectangle = (value: string) => {
  let [width, length] = value.split(' ');
  length ? length : length = width;
  robot.setMouseDelay(100);

  [
    [+width, 0],
    [0, +length],
    [-width, 0],
    [0, -length]
  ].forEach((arr) => {
    const mousePos = robot.getMousePos();
    robot.mouseToggle('down');

    const x = mousePos.x + arr[0];
    const y = mousePos.y + arr[1];

    robot.dragMouse(x, y);
  });
};