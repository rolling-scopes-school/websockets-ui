import robot from "robotjs";

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export function moveMouse(direction: Direction, distance: number) {
  const { x, y } = robot.getMousePos();

  if (direction === Direction.UP) {
    robot.moveMouse(x, y - distance);
  }

  if (direction === Direction.DOWN) {
    robot.moveMouse(x, y + distance);
  }

  if (direction === Direction.LEFT) {
    robot.moveMouse(x - distance, y);
  }

  if (direction === Direction.RIGHT) {
    robot.moveMouse(x + distance, y);
  }
}

export function getMousePosition() {
  const { x, y } = robot.getMousePos();
  return ` ${x},${y}`;
}
