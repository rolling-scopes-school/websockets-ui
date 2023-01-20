import CircleDrawAction from './CircleDrawAction';
import RectangleDrawAction from './RectangleDrawAction';

const commandDrawingConfig = {
  draw_circle: (args: string[]) => new CircleDrawAction(args),
  draw_rectangle: (args: string[]) => new RectangleDrawAction(args),
  // draw_square 100
  // draw_rectangle 100 100
};

export default commandDrawingConfig;
