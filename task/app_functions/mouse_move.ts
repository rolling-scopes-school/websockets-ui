import robot from "robotjs";

const MouseMove = function(mX: any = 0, mY: any = 0) {
    robot.moveMouse(robot.getMousePos().x + mX, robot.getMousePos().y + mY);
  }

export default MouseMove;