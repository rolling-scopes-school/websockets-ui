import CommandConfigType from './commandConfigType';
import {
  mouseDown,
  mouseLeft,
  mouseRight,
  mouseUp,
} from '../action/mouse/mouseMove';
import validateArgs from './commandArgsValidator';
import {
  MouseMoveResultType,
  MousePositionResultType,
} from '../action/mouse/type/mouseActionType';
import getMousePosition from '../action/mouse/mousePosition';

const MOUSE_ARGS_LENGTH = 1;

const commandConfig: CommandConfigType = {
  mouse_up: {
    action: async (args: string[]) => mouseUp(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveResultType) => `mouse_up ${result.step}`,
  },
  mouse_down: {
    action: async (args: string[]) => mouseDown(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveResultType) =>
      `mouse_down ${result.step}`,
  },
  mouse_left: {
    action: async (args: string[]) => mouseLeft(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveResultType) =>
      `mouse_left ${result.step}`,
  },
  mouse_right: {
    action: async (args: string[]) => mouseRight(args),
    validate: (args: string[]) => validateArgs(args, MOUSE_ARGS_LENGTH),
    formatResponse: (result: MouseMoveResultType) =>
      `mouse_right ${result.step}`,
  },
  mouse_position: {
    action: async () => getMousePosition(),
    validate: () => true,
    formatResponse: ({ x, y }: MousePositionResultType) =>
      `mouse_position ${x},${y}`,
  },
  // draw_circle 100
  // draw_square 100
  // draw_rectangle 100 100
  // prnt_scrn
};

export default commandConfig;
