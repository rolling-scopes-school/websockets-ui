import * as stream from 'stream';
import robot from 'robotjs';

export const drawRectangle = (
  duplex: stream.Duplex,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  robot.mouseToggle('down');
  robot.moveMouseSmooth(x + width, y);
  robot.moveMouseSmooth(x + width, y + height);
  robot.moveMouseSmooth(x, y + height);
  robot.moveMouseSmooth(x, y);
  robot.mouseToggle('up');
  duplex.write(`draw_rectangle \0`, 'utf-8');
};
