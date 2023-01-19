import { mouse, right } from '@nut-tree/nut-js';
import AbstractMouseMoveAction from './AbstractMouseMoveAction';

class MouseMoveRightAction extends AbstractMouseMoveAction {
  protected setMouseMoveType = () => {
    this.mouseMoveType = 'mouse_right';
  };

  protected move = async (): Promise<void> => {
    await mouse.move(await right(this.step));
  };
}

export default MouseMoveRightAction;
