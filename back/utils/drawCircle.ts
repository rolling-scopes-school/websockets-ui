import robot from "robotjs";

export function drawCircle(radius: number) {
  robot.setMouseDelay(2);
  const mousePos = robot.getMousePos();
  console.log(`mousePos ${mousePos.x} ${mousePos.y}`);

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const x = mousePos.x + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);
    if (i === 0.03) {
      robot.mouseToggle("down");
    }
    robot.dragMouse(x, y);
  }
  robot.mouseToggle("up");
}
