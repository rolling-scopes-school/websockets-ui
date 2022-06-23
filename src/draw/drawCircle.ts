import robot from 'robotjs';

export const drawCircle = (x: number, y: number, radius: number) => {
  for (let i = 0; i < Math.PI * 2; i += 0.1) {
    // Convert polar coordinates to cartesian
    const newX = x + radius * Math.cos(i);
    const newY = y + radius * Math.sin(i);

    robot.dragMouse(newX, newY);
    if (i === 0) {
      robot.mouseToggle('down'); // skip first point in the center
    }
  }
  robot.dragMouse(x + radius, y); // return to first point to close figure
  robot.mouseToggle('up');
  return true;
};
