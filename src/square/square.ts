import { IMousePosition } from '../../interfaces';
import { DELAY } from '../../constants';

class Square {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  drawSquare(width: number): void {
    const mouse: IMousePosition = this.robot.getMousePos();
    this.robot.setMouseDelay(DELAY);
    this.robot.mouseToggle('down');
    this.robot.dragMouse(mouse.x + width, mouse.y);
    this.robot.dragMouse(mouse.x + width, mouse.y + width);
    this.robot.dragMouse(mouse.x + width - width, mouse.y + width);
    this.robot.dragMouse(mouse.x, mouse.y);
    this.robot.mouseToggle('up');
  }
}

export default Square;
