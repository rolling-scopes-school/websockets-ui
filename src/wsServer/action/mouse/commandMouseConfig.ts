import MouseMoveUpAction from './MouseMoveUpAction';
import MouseMoveDownAction from './MouseMoveDownAction';
import MouseMoveLeftAction from './MouseMoveLeftAction';
import MouseMoveRightAction from './MouseMoveRightAction';
import MousePositionAction from './MousePositionAction';

const commandMouseConfig = {
  mouse_up: (args: string[]) => new MouseMoveUpAction(args),
  mouse_down: (args: string[]) => new MouseMoveDownAction(args),
  mouse_left: (args: string[]) => new MouseMoveLeftAction(args),
  mouse_right: (args: string[]) => new MouseMoveRightAction(args),
  mouse_position: () => new MousePositionAction(),
};

export default commandMouseConfig;
