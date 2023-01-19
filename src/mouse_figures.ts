import {
    Point,
    down,
    left,
    mouse,
    right,
    up,
  } from "@nut-tree/nut-js";
  
  async function mouseDraw(command: any[]) {
    try {
      const commandType = command[0];
    const size = [Number(command[1]), Number(command[2])];
    if (commandType === "draw_square") {
      await (
        await (
          await (await mouse.drag(left(size[0]))).drag(up(size[0]))
        ).drag(right(size[0]))
      ).drag(down(size[0]));
    } else if (commandType === "draw_circle") {
      const {x,y} = await mouse.getPosition()
      const startIndex = {x,y}
      let circle: Point[]= []

      await mouse.drag(circle)
      circle = []
    } else if (commandType === "draw_rectangle") {
      await (
        await (
          await (await mouse.drag(left(size[0]))).drag(up(size[1]))
        ).drag(right(size[0]))
      ).drag(down(size[1]));
    }
    } catch (error) {
      console.log(error);
      await (
        await (
          await (await mouse.drag(left(100))).drag(up(100))
        ).drag(right(100))
      ).drag(down(100));
    }
  }
  
  export default mouseDraw;
  