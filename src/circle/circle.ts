import { IMousePosition } from '../../interfaces';

class Circle {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  drawCircle(radius: number): void {
    const mousePos: IMousePosition = this.robot.getMousePos();
    this.robot.mouseToggle('down');
    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      const x = mousePos.x + radius * Math.cos(i);
      const y = mousePos.y + radius * Math.sin(i);

      this.robot.dragMouse(x, y);
    }

    this.robot.mouseToggle('up');
  }
}

export default Circle;
