import * as stream from 'stream';
import robot from 'robotjs';

export const drawCircle = (duplex: stream.Duplex, x: number, y: number, width: number) => {
  robot.mouseToggle('down');
  for (let i = 0; i <= Math.PI * 2; i += 0.05) {
    const newX = x + width * Math.cos(i) - width;
    const newY = y + width * Math.sin(i);
    robot.dragMouse(newX, newY);
  }
  robot.mouseToggle('up');
  duplex.write(`draw_circle \0`, 'utf-8');
};
