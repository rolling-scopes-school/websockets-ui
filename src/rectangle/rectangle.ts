import { IMousePosition } from '../../interfaces';
import { DELAY, MOUSE } from '../../constants';

class Rectangle {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  drawRectangle(rectangleProps: number[]): void {
    const [width, height]: number[] = rectangleProps;
    const mouse: IMousePosition = this.robot.getMousePos();
    this.robot.setMouseDelay(DELAY.CUSTOM);
    this.robot.mouseToggle(MOUSE.DOWN);
    this.robot.dragMouse(mouse.x + width, mouse.y);
    this.robot.dragMouse(mouse.x + width, mouse.y + height);
    this.robot.dragMouse(mouse.x + width - width, mouse.y + height);
    this.robot.dragMouse(mouse.x, mouse.y);
    this.robot.mouseToggle(MOUSE.UP);
  }
}

export default Rectangle;
