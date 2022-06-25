import robot from "robotjs";

export function drawSquare(length: number) {
  const { x, y } = robot.getMousePos();
  robot.mouseToggle("down");
  robot.moveMouseSmooth(x + length, y);
  robot.moveMouseSmooth(x + length, y + length);
  robot.moveMouseSmooth(x, y + length);
  robot.moveMouseSmooth(x, y);
  robot.mouseToggle("up");
}

export function drawRectangle(length: number, width: number) {
  const { x, y } = robot.getMousePos();
  robot.mouseToggle("down");
  robot.moveMouseSmooth(x + width, y);
  robot.moveMouseSmooth(x + width, y + length);
  robot.moveMouseSmooth(x, y + length);
  robot.moveMouseSmooth(x, y);
  robot.mouseToggle("up");
}

export function drawCircle(radius: number) {
  const { x, y } = robot.getMousePos();
  robot.mouseToggle("down");

  const centerX = x + radius;
  const centerY = y;
  const points = [];

  const step = 0.02;

  for (let a = 0; a < 2 * Math.PI + step; a += step) {
    let point: { x?: number; y?: number } = {};
    point.x = centerX - radius * Math.cos(a);
    point.y = centerY - radius * Math.sin(a);
    points.push(point);
    robot.moveMouseSmooth(point.x, point.y);
  }

  robot.mouseToggle("up");
}
