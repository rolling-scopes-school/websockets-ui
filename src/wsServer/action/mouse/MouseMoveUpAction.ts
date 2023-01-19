import { mouse, up } from '@nut-tree/nut-js';
import AbstractMouseMoveAction from './AbstractMouseMoveAction';

class MouseMoveUpAction extends AbstractMouseMoveAction {
  protected setMouseMoveType = () => {
    this.mouseMoveType = 'mouse_up';
  };

  protected move = async (): Promise<void> => {
    await mouse.move(await up(this.step));
  };
}

export default MouseMoveUpAction;
