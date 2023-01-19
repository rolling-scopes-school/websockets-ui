import assertNotEmpty from '../../shared/assert/assertNotEmpty';
import { RADIX_10 } from '../../shared/radix';

const FIRST_ARG_INDEX = 0;

const parseStep = (args: string[]): number => {
  const step = args[FIRST_ARG_INDEX] ?? undefined;

  assertNotEmpty(step);

  const stepNumber = parseInt(step, RADIX_10);

  assertNotEmpty(stepNumber);

  return stepNumber;
};

export default parseStep;
