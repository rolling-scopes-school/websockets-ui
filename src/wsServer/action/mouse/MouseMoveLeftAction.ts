import { left, mouse } from '@nut-tree/nut-js';
import AbstractMouseMoveAction from './AbstractMouseMoveAction';

class MouseMoveLeftAction extends AbstractMouseMoveAction {
  protected setMouseMoveType = () => {
    this.mouseMoveType = 'mouse_left';
  };

  protected move = async (): Promise<void> => {
    await mouse.move(await left(this.step));
  };
}

export default MouseMoveLeftAction;
