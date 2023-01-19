import { mouse, down, up, left, right } from '@nut-tree/nut-js';
import parseStep from '../../parser/stepParser';
import { MouseMoveResultType } from './type/mouseActionType';
import MouseMoveType from './type/mouseMoveType';

const mouseMove = async (
  direction: MouseMoveType,
  args: string[],
): Promise<MouseMoveResultType> => {
  const step = parseStep(args);

  await mouse.move(await direction(step));

  return { step };
};

const mouseUp = async (args: string[]): Promise<MouseMoveResultType> => {
  return mouseMove(up, args);
};

const mouseDown = (args: string[]): Promise<MouseMoveResultType> => {
  return mouseMove(down, args);
};

const mouseLeft = (args: string[]): Promise<MouseMoveResultType> => {
  return mouseMove(left, args);
};

const mouseRight = (args: string[]): Promise<MouseMoveResultType> => {
  return mouseMove(right, args);
};

export { mouseUp, mouseRight, mouseLeft, mouseDown };
