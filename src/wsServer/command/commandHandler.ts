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

const getCommandConfig = (action: string | undefined) => {
  assertNotEmpty(action, COMMAND_NOT_FOUND);

  if (!(action in commandConfig)) {
    throw new Error(COMMAND_NOT_FOUND);
  }

  const commandHandler = commandConfig[action];

  assertNotEmpty(commandHandler, COMMAND_NOT_FOUND);

  return commandHandler;
};

const handleCommand = async (rawCommand: string): Promise<string> => {
  const parsedCommand = parseCommand(rawCommand);
  const { action, args } = parsedCommand;
  const command = getCommandConfig(action);
  const result = await command.action({ ...args });
  const response = command.formatResponse(result);

  return response;
};

export { handleCommand };
