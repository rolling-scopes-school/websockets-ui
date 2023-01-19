import { mouse, down, up, left, right } from '@nut-tree/nut-js';
import parseStep from '../../parser/stepParser';
import { MouseMoveDtoResponseType, MouseMoveType } from './mouseType';

const mouseMove = async (
  direction: MouseMoveType,
  args: string[],
): Promise<MouseMoveDtoResponseType> => {
  const step = parseStep(args);

  await mouse.move(await direction(step));

  return { step };
};

const mouseUp = async (args: string[]): Promise<MouseMoveDtoResponseType> => {
  return mouseMove(up, args);
};

const mouseDown = (args: string[]) => {
  return mouseMove(down, args);
};

const mouseLeft = (args: string[]) => {
  return mouseMove(left, args);
};

const mouseRight = (args: string[]) => {
  return mouseMove(right, args);
};

export { mouseUp, mouseRight, mouseLeft, mouseDown };
