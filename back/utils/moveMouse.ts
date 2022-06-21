import robot from "robotjs";

export function moveMouse(x = 0, y = 0) {
  const mousePos = robot.getMousePos();

  const newX = mousePos.x + x;
  const newY = mousePos.y + y;
  robot.moveMouse(newX, newY);

}
