import { down, mouse } from '@nut-tree/nut-js';
import AbstractMouseMoveAction from './AbstractMouseMoveAction';

class MouseMoveDownAction extends AbstractMouseMoveAction {
  protected setMouseMoveType = () => {
    this.mouseMoveType = 'mouse_down';
  };

  protected move = async (): Promise<void> => {
    await mouse.move(await down(this.step));
  };
}

export default MouseMoveDownAction;
