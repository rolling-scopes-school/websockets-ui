import { IMousePosition } from '../../interfaces';
import { DELAY, MOUSE } from '../../constants';

class Square {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  drawSquare(width: number): void {
    const mouse: IMousePosition = this.robot.getMousePos();
    this.robot.setMouseDelay(DELAY.CUSTOM);
    this.robot.mouseClick();
    this.robot.mouseToggle(MOUSE.DOWN);
    this.robot.dragMouse(mouse.x + width, mouse.y);
    this.robot.dragMouse(mouse.x + width, mouse.y + width);
    this.robot.dragMouse(mouse.x + width - width, mouse.y + width);
    this.robot.dragMouse(mouse.x, mouse.y);
    this.robot.mouseToggle(MOUSE.UP);
  }
}

export default Square;
