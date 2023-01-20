import {
  Button,
  Point,
  down,
  left,
  mouse,
  right,
  straightTo,
  up
} from "@nut-tree/nut-js";


async function mouseDraw(command: any[]) {
  try {
    const commandType = command[0];
    const size = [Number(command[1]), Number(command[2])];
    const objControl: { [index: string]: any } = {
      "draw_square": async () => {
        await (
          await (
            await (await mouse.drag(left(size[0]))).drag(up(size[0]))
          ).drag(right(size[0]))
        ).drag(down(size[0]));
      },
      "draw_circle": async () => {
        const { x, y } = await mouse.getPosition()
        await mouse.pressButton(Button.LEFT)
        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
          const xCor = x + size[0] * Math.cos(i);
          const yCor = y + size[0] * Math.sin(i);
          const newPoint = new Point(xCor, yCor);
          await mouse.move(straightTo(newPoint));
        }
        await mouse.releaseButton(Button.LEFT)
      },
      "draw_rectangle": async()=>{
        await (
          await (
            await (await mouse.drag(left(size[0]))).drag(up(size[1]))
          ).drag(right(size[0]))
        ).drag(down(size[1]));
      }
    }
    if (commandType) {
      await objControl[commandType]()
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
