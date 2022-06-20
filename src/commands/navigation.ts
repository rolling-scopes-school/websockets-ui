import robot from "robotjs";

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

const { getMousePos } = robot;

export async function moveMouse(direction: Direction, distanceRaw: string) {
  const { x, y } = getMousePos();
  const distance = Number(distanceRaw);

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

export async function getMousePosition() {
  const { x, y } = robot.getMousePos();
  return ` ${x},${y}`;
}
