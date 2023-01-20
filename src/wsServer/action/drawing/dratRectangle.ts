import { down, left, right, up } from '@nut-tree/nut-js';
import drawLine from './drawLine';

const drawRectangle = async (width: number, length: number): Promise<void> => {
  await drawLine(await down(width));
  await drawLine(await right(length));
  await drawLine(await up(width));
  await drawLine(await left(length));
};

export default drawRectangle;
