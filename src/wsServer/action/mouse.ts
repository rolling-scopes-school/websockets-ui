import { mouse } from '@nut-tree/nut-js';
import assertNotEmpty from '../../shared/assert/assertNotEmpty';

export type MouseMoveDtoResponseType = {
  step: number;
};

const getStep = (args: string[]): number => {
  const step = args[0] ?? undefined;

  assertNotEmpty(step);

  const stepNumber = Number(step);

  assertNotEmpty(stepNumber);

  return stepNumber;
};

const mouseUp = async (args: string[]): Promise<MouseMoveDtoResponseType> => {
  const step = getStep(args);

  // const response = ''
  return { step };
};

const mouseDown = (args: string[]) => {
  const step = args[0];
};

const mouseLeft = (args: string[]) => {
  const step = args[0];
};

const mouseRight = (args: string[]) => {
  const step = args[0];
};

export { mouseUp, mouseRight, mouseLeft, mouseDown };
