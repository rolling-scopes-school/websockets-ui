import assertNotEmpty from '../../shared/assert/assertNotEmpty';
import { COMMAND_NOT_FOUND } from '../message/error';
import {
  mouseDown,
  mouseLeft,
  mouseRight,
  mouseUp,
} from '../action/mouse/mouseAction';
import assertArrayLength from '../../shared/assert/assertArrayLength';
import { MouseMoveDtoResponseType } from '../action/mouse/mouseType';

type DtoResponseType = MouseMoveDtoResponseType;

type CommandConfigType = {
  [key: string]: {
    action: (args: string[]) => Promise<DtoResponseType>;
    validate: (args: string[]) => boolean;
    formatResponse: (result: DtoResponseType) => string;
  };
};

const validateArgs = (args: string[], argsLength: number) => {
  assertArrayLength(args, argsLength, 'Invalid number of arguments');

  return true;
};

const MOUSE_ARGS_LENGTH = 1;

const commandConfig: CommandConfigType = {
  mouse_up: {
    action: async (args: string[]) => mouseUp(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveDtoResponseType) =>
      `mouse_up ${result.step}`,
  },
  mouse_down: {
    action: async (args: string[]) => mouseDown(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveDtoResponseType) =>
      `mouse_down ${result.step}`,
  },
  mouse_left: {
    action: async (args: string[]) => mouseLeft(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveDtoResponseType) =>
      `mouse_left ${result.step}`,
  },
  mouse_right: {
    action: async (args: string[]) => mouseRight(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveDtoResponseType) =>
      `mouse_right ${result.step}`,
  },
  // mouse_position
  // draw_circle 100
  // draw_square 100
  // draw_rectangle 100 100
  // prnt_scrn
};

const parseCommand = async (rawCommand: string) => {
  const [action, ...args] = rawCommand.split(' ');

  const parsedCommand = {
    action,
    args,
  };

  return parsedCommand;
};

const getCommand = (action: string | undefined) => {
  assertNotEmpty(action, COMMAND_NOT_FOUND);

  if (!(action in commandConfig)) {
    throw new Error(COMMAND_NOT_FOUND);
  }

  const command = commandConfig[action];

  assertNotEmpty(command, COMMAND_NOT_FOUND);

  return command;
};

const handleCommand = async (rawCommand: string): Promise<string> => {
  const parsedCommand = await parseCommand(rawCommand);
  const { action, args } = parsedCommand;
  const command = getCommand(action);
  const result = await command.action({ ...args });
  const response = command.formatResponse(result);

  return response;
};

export { handleCommand };
