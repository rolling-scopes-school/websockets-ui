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

  //TODO PASS SIZE FROM SERVER
  getScreenCapture() {
    const size = 200;
    const position = this.getMousePosition();
    return this.robot.screen.capture(position.x, position.y, size, size).image;
  }
}

export default Capture;
