import robot from "robotjs";

export function drawRectangle(width: number, height: number) {
  drawLine(width, 1, true);
  drawLine(height, 1, false);
  drawLine(width, -1, true);
  drawLine(height, -1, false);
}

function drawLine(size: number, coefficient: number, isX: boolean) {
  robot.setMouseDelay(4);
  const mousePos = robot.getMousePos();
  for (let i = 0; i <= size; i++) {
    if (isX) {
      robot.dragMouse(mousePos.x + i * coefficient, mousePos.y);
    } else {
      robot.dragMouse(mousePos.x, mousePos.y + i * coefficient);
    }
  }
}
