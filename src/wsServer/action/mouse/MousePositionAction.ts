import { mouse } from '@nut-tree/nut-js';
import ActionInterface from '../ActionInterface';

class MousePositionAction implements ActionInterface {
  public execute = async (): Promise<string> => {
    const { x, y } = await mouse.getPosition();

    return `mouse_position ${x},${y}`;
  };
}

export default MousePositionAction;
