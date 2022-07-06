import * as stream from 'stream';
import robot from 'robotjs';

export const drawSquare = (duplex: stream.Duplex, x: number, y: number, width: number) => {
  robot.mouseToggle('down');
  robot.moveMouseSmooth(x + width, y);
  robot.moveMouseSmooth(x + width, y + width);
  robot.moveMouseSmooth(x, y + width);
  robot.moveMouseSmooth(x, y);
  robot.mouseToggle('up');
  duplex.write(`draw_square \0`, 'utf-8');
};
