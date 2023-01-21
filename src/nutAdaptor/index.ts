import {
  mouse,
  up,
  down,
  left,
  right,
  Point,
  straightTo,
} from "@nut-tree/nut-js";
import { Duplex } from "stream";

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
    }
  }
}
