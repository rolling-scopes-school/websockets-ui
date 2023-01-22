import {
  mouse,
  up,
  down,
  left,
  right,
  Point,
  straightTo,
  screen,
  Region,
} from "@nut-tree/nut-js";
import { Duplex } from "stream";
import Jimp from "jimp";

export class NutAdaptor {
  async mousePosition(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    if (webSocket) {
      const coords = await mouse.getPosition();
      const answer = `mouse_position ${coords.x},${coords.y}`;
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async mouseUp(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const step: number = +arguments[1] ?? 0;
    if (webSocket) {
      await mouse.move(up(step));
      const answer = "mouse_up";
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async mouseDown(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const step: number = +arguments[1] ?? 0;
    if (webSocket) {
      await mouse.move(down(step));
      const answer = "mouse_down";
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async mouseLeft(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const step: number = +arguments[1] ?? 0;
    if (webSocket) {
      await mouse.move(left(step));
      const answer = "mouse_left";
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async mouseRight(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const step: number = +arguments[1] ?? 0;
    if (webSocket) {
      await mouse.move(right(step));
      const answer = "mouse_right";
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async drawRectangle(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const width: number = +arguments[1] ?? 0;
    const height: number = +arguments[2] ?? 0;
    if (webSocket) {
      mouse.config.mouseSpeed = 100;
      await mouse.pressButton(0);
      await mouse.drag(right(width));
      await mouse.drag(down(height));
      await mouse.drag(left(width));
      await mouse.drag(up(height));
      await mouse.releaseButton(0);
      const answer = `draw_rectangle ${width},${height}`;
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async drawSquare(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const width: number = +arguments[1] ?? 0;
    if (webSocket) {
      mouse.config.mouseSpeed = 100;
      await mouse.pressButton(0);
      await mouse.drag(right(width));
      await mouse.drag(down(width));
      await mouse.drag(left(width));
      await mouse.drag(up(width));
      await mouse.releaseButton(0);
      const answer = `draw_square ${width}`;
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async drawCircle(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const radius: number = +arguments[1] ?? 0;
    if (webSocket) {
      const coords = await mouse.getPosition();
      await mouse.pressButton(0);
      for (let i = 0; i <= Math.PI * 2; i += 0.06) {
        const x = coords.x - radius * Math.cos(i) + radius;
        const y = coords.y - radius * Math.sin(i);
        await mouse.drag(straightTo(new Point(x, y)));
      }
      await mouse.releaseButton(0);

      const answer = `draw_circle ${radius}`;
      console.log(`-> ${answer}`);
      webSocket.write(answer);
    }
  }

  async printScreen(): Promise<void> {
    const webSocket: Duplex = arguments[0];
    const screenShotWidth = 200;
    const screenShotHeight = 200;

    if (webSocket) {
      const screenWidth = await screen.width();
      const screenHeight = await screen.height();
      const coords = await mouse.getPosition();

      coords.x = Math.max(coords.x - screenShotWidth / 2, screenShotWidth / 2);
      coords.x = Math.min(coords.x, screenWidth - screenShotWidth / 2);
      coords.y = Math.max(
        coords.y - screenShotHeight / 2,
        screenShotHeight / 2
      );
      coords.y = Math.min(coords.y, screenHeight - screenShotHeight / 2);

      const region = new Region(
        coords.x - screenShotWidth / 2,
        coords.y - screenShotHeight / 2,
        screenShotWidth,
        screenShotHeight
      );

      try {
        const { data, width, height } = await (
          await screen.grabRegion(region)
        ).toRGB();

        const image = new Jimp({ data, width, height });
        const imageBase64 = (
          await image.getBufferAsync(Jimp.MIME_PNG)
        ).toString("base64");

        const answer = `prnt_scrn ${imageBase64}`;
        console.log(`-> ${answer}`);
        webSocket.write(answer);
      } catch (error: any) {
        console.log(`:: Got error: ${error.message}`);
      }
    }
  }
}
