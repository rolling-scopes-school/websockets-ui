import robot from "robotjs";

const SendMousePos = function(mX: any = 0, mY: any = 0) {
  let pos = robot.getMousePos();
  return `${pos.x},${pos.y}`;
}

export default SendMousePos;