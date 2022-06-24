import { IMousePosition } from '../../interfaces';
import { DELAY, MOUSE } from '../../constants';

class Circle {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  drawCircle(radius: number): void {
    const mousePos: IMousePosition = this.robot.getMousePos();
    this.robot.setMouseDelay(DELAY.DEFAULT);
    this.robot.mouseClick();
    this.robot.moveMouse(mousePos.x + radius, mousePos.y);
    this.robot.mouseToggle(MOUSE.DOWN);

    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      const x = mousePos.x + radius * Math.cos(i);
      const y = mousePos.y + radius * Math.sin(i);

      this.robot.dragMouse(x, y);
    }

    this.robot.mouseToggle(MOUSE.UP);
  }
}

export default Circle;
