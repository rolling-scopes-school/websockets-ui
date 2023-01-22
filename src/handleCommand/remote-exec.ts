import { mouse, left, right, up, down } from "@nut-tree/nut-js";
//export const DIRECTIONS_SET = new Set([ 'left', 'right', 'up', 'down']);
export enum DIRECTIONS {
  left = "left",
  right = "right",
  up = "up",
  down = "down",
}

const POSITION = 'position';

export const moveMouse = async (dir: string, value: string) => {
  const shift = Number(value);
  if (!isNaN(shift)) {
    switch (dir) {
      case DIRECTIONS.left:
        await mouse.move(left(shift));
        break;
      case DIRECTIONS.right:
        await mouse.move(right(shift));
        break;
      case DIRECTIONS.up:
        await mouse.move(up(shift));
        break;
      case DIRECTIONS.down:
        await mouse.move(down(shift));
        break;
      case POSITION:
        break;
    }
  }
};

