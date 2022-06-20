import { IMousePosition } from '../../interfaces';

class Capture {
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

  getScreenCapture() {
    const size = 100;
    const position: IMousePosition = this.getMousePosition();
    return this.robot.screen.capture(position.x, position.y, size, size);
  }
}

export default Capture;
