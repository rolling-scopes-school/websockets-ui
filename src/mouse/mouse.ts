import { IMousePosition } from '../../interfaces';
import { COMMANDS } from '../../constants';

class Mouse {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  private getMousePosition(): IMousePosition {
    const mouse: IMousePosition = this.robot.getMousePos();

    return {
      x: mouse.x,
      y: mouse.y,
    };
  }

  moseMove({ action, position }: { action: string; position: number }) {
    const mousePosition: IMousePosition = this.getMousePosition();

    switch (action) {
      case COMMANDS.MOUSE_UP:
        this.robot.moveMouse(mousePosition.x, mousePosition.y - position);
        break;
      case COMMANDS.MOUSE_DOWN:
        this.robot.moveMouse(mousePosition.x, mousePosition.y + position);
        break;
      case COMMANDS.MOUSE_LEFT:
        this.robot.moveMouse(mousePosition.x - position, mousePosition.y);
        break;
      case COMMANDS.MOUSE_RIGHT:
        this.robot.moveMouse(mousePosition.x + position, mousePosition.y);
        break;
    }
  }

  mousePosition(): IMousePosition {
    return this.getMousePosition();
  }
}

export default Mouse;
