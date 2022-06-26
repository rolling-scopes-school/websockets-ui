import robot from 'robotjs';

export const drawCircle = (radius: string) => {
  const mousePos = robot.getMousePos();

  for (let i = 0; i <= Math.PI * 2 + 0.1; i += 0.1) {
    robot.mouseToggle('down');

    const x = mousePos.x - 100 + +radius * Math.cos(i);
    const y = mousePos.y + +radius * Math.sin(i);

    robot.dragMouse(x, y);
  }
  robot.mouseToggle('up');
};