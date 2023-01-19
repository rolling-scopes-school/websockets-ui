import { mouse } from '@nut-tree/nut-js';
import { MousePositionResultType } from './type/mouseActionType';

const getMousePosition = async (): Promise<MousePositionResultType> => {
  const { x, y } = await mouse.getPosition();

  return { x, y };
};

export default getMousePosition;
