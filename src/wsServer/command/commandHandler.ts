import assertNotEmpty from '../../shared/assert/assertNotEmpty';
import { COMMAND_NOT_FOUND } from '../message/error';

import commandConfig from './commandConfig';

export const parseCommand = (rawCommand: string) => {
  const [action, ...args] = rawCommand.split(' ');

  const parsedCommand = {
    action: String(action),
    args: args.map((arg) => String(arg)),
  };

  return parsedCommand;
};

const getCommandActionFromConfig = (
  action: string | undefined,
  args: string[],
) => {
  assertNotEmpty(action, COMMAND_NOT_FOUND);

  if (!(action in commandConfig)) {
    throw new Error(COMMAND_NOT_FOUND);
  }

  const commandHandler = commandConfig[action];

  assertNotEmpty(commandHandler, COMMAND_NOT_FOUND);

  return commandHandler(args);
};

const handleCommand = async (rawCommand: string): Promise<string> => {
  const parsedCommand = parseCommand(rawCommand);
  const { action, args } = parsedCommand;
  const commandAction = getCommandActionFromConfig(action, args);

  const result = await commandAction.execute();

  return result;
};

export { handleCommand };
