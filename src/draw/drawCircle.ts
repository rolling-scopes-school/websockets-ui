import robot from 'robotjs';

export const drawCircle = (x: number, y: number, radius: number) => {
  for (let i = 0; i <= Math.PI * 2; i += 0.05) {
    // Convert polar coordinates to cartesian
    const newX = x + radius * Math.cos(i);
    const newY = y + radius * Math.sin(i);

    robot.dragMouse(newX, newY);
  }
  return true;
};
