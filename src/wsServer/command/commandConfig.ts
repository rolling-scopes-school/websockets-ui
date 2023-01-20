import CommandConfigType from './commandConfigType';
import MouseMoveUpAction from '../action/mouse/MouseMoveUpAction';
import MouseMoveDownAction from '../action/mouse/MouseMoveDownAction';
import MouseMoveLeftAction from '../action/mouse/MouseMoveLeftAction';
import MouseMoveRightAction from '../action/mouse/MouseMoveRightAction';
import MousePositionAction from '../action/mouse/MousePositionAction';
import CircleDrawAction from '../action/mouse/drawing/CircleDrawAction';

const commandConfig: CommandConfigType = {
  mouse_up: (args: string[]) => new MouseMoveUpAction(args),
  mouse_down: (args: string[]) => new MouseMoveDownAction(args),
  mouse_left: (args: string[]) => new MouseMoveLeftAction(args),
  mouse_right: (args: string[]) => new MouseMoveRightAction(args),
  mouse_position: () => new MousePositionAction(),
  draw_circle: (args: string[]) => new CircleDrawAction(args),
  // draw_square 100
  // draw_rectangle 100 100
  // prnt_scrn
};

export default commandConfig;
