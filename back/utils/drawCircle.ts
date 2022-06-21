import robot from "robotjs";

export function drawCircle(radius: number) {
  robot.setMouseDelay(2);
  const mousePos = robot.getMousePos();

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const x = mousePos.x + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);

    robot.dragMouse(x, y);
  }
}
