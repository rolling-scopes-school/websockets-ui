import { WebSocket, createWebSocketStream } from "ws";
import { Commands } from "../constant/index";
import * as mouseMove from "./mouseMove";
import { circleMove } from "./circleMove";
import { rectangleMove } from "./rectangleMove";

export type Command = {
  command: string;
  firstParameter?: string;
  secondParameter?: string;
};

export const textCommand = (text: string): Command => {
  if (text.includes(" ")) {
    return {
      command: text.toString().split(" ")[0],
      firstParameter: text.toString().split(" ")[1],
      secondParameter: text.toString().split(" ")[2] || undefined,
    };
  }
  return {
    command: text,
  };
};

export const messageStream = (ws: WebSocket) => {
  const duplex = createWebSocketStream(ws, {
    encoding: "utf8",
    decodeStrings: false,
  });

  duplex.on("data", async (chunk) => {
    const { command, firstParameter, secondParameter } = textCommand(
      chunk.toString()
    );

    console.log(`Output: ${chunk.toString()}`);

    if (command) {
      switch (command) {
        default:
          duplex.write("Invalid request");
          break;
        case Commands.MOUSE_UP:
          mouseMove.mouseMoveUp(Number(firstParameter));
          duplex.write(`${command} \0`);
          break;
        case Commands.MOUSE_DOWN:
          mouseMove.mouseMoveDown(Number(firstParameter));
          duplex.write(`${command} \0`);
          break;
        case Commands.MOUSE_LEFT:
          mouseMove.mouseMoveLeft(Number(firstParameter));
          duplex.write(`${command} \0`);
          break;
        case Commands.MOUSE_RIGHT:
          mouseMove.mouseMoveRight(Number(firstParameter));
          duplex.write(`${command} \0`);
          break;
        case Commands.MOUSE_POSITION: {
          const { x, y } = mouseMove.mouseMovePosition();
          duplex.write(`${command}: ${x}, ${y} \0`);
          break;
        }
        case Commands.DRAW_CIRCLE:
          circleMove(Number(firstParameter));
          duplex.write(`${command} \0`);
          break;
        case Commands.DRAW_RECTANGLE:
          rectangleMove(Number(firstParameter), Number(secondParameter));
          duplex.write(`${command} \0`);
          break;
        case Commands.DRAW_SQUARE:
          rectangleMove(Number(firstParameter), Number(firstParameter));
          duplex.write(`${command} \0`);
          break;
      }
    }
  });

  ws.on("close", () => {
    process.stdout.write("Server closed!");
    duplex.destroy();
    process.exit();
  });
};
