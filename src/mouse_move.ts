import { down, left, mouse, right, up } from "@nut-tree/nut-js";

async function mouseMove(command: any[]) {
  try {
    const commandType = command[0];
  const position = Number(command[1]);
  if (commandType === "mouse_right") {
    await mouse.move(right(position));
  } else if (commandType === "mouse_left") {
    await mouse.move(left(position));
  } else if (commandType === "mouse_up") {
    await mouse.move(up(position));
  } else if (commandType === "mouse_down") {
    await mouse.move(down(position));
  } else if (commandType === "mouse_position") {
    const {x, y} = await mouse.getPosition()
    return `mouse_position ${x}px,${y}px`;
  }
  } catch (error) {
   console.log(error);
   return "mouse_position 0px,0px"
  }
}

export default mouseMove;
