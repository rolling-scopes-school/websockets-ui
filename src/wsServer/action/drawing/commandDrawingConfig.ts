import CircleDrawAction from './CircleDrawAction';
import RectangleDrawAction from './RectangleDrawAction';
import SquareDrawAction from './SquareDrawAction';

const commandDrawingConfig = {
  draw_circle: (args: string[]) => new CircleDrawAction(args),
  draw_square: (args: string[]) => new SquareDrawAction(args),
  draw_rectangle: (args: string[]) => new RectangleDrawAction(args),
};

export default commandDrawingConfig;
