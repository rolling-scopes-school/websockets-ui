import { down, left, mouse, right, up } from "@nut-tree/nut-js";

async function mouseMove(command: any[]) {
  try {
    const commandType = command[0];
    const position = Number(command[1]);
    const objControl: { [index: string]: () => Promise< void | string> } = {
      "mouse_right": async () => {
        await mouse.move(right(position));
      },
      "mouse_left": async () => {
        await mouse.move(left(position));
      },
      "mouse_up": async () => {
        await mouse.move(up(position));
      },
      "mouse_down": async () => {
        await mouse.move(down(position));
      },
      "mouse_position": async () => {
        const { x, y } = await mouse.getPosition()
        return `mouse_position ${x}px,${y}px`;
      }
    }
    if (commandType){
      const position = await objControl[commandType]()
      if(position){
        return position
      }
    }
  } catch (error) {
    console.log(error);
    return "mouse_position 0px,0px"
  }
}

export default mouseMove;
