import assertArrayLength from '../../shared/assert/assertArrayLength';

const validateArgs = (args: string[], argsLength: number) => {
  assertArrayLength(args, argsLength, 'Invalid number of arguments');

  return true;
};

export default validateArgs;
