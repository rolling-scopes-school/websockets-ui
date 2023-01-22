import { DIRECTIONS, moveMouse } from "./remote-exec";

enum COMMANDS {
  mouse = "mouse",
  draw = "draw",
  prnt = "prnt",
}

export const handleCommand = async (commandInput: string) => {
  const command = commandInput.split("_");
  console.log(command);
  if (command.length < 2) throw new Error("Wrong command");

  const param = command[1].split(" ").filter((item) => !!item.trim());
  console.log(COMMANDS.mouse, command[0]);
  try {
    switch (command[0]) {
      case COMMANDS.mouse:
        handleMouse(param);
        break;
      case COMMANDS.draw:
        handleDraw(param);
        break;
      case COMMANDS.prnt:
        handlePrnt(param);
        break;
      default:
        throw new Error("Wrong command");
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const handleMouse = async (params: string[]) => {
  if (params.length !== 2) throw new Error("Invalid params");
  await moveMouse(params[0], params[1]);
};

const handleDraw = async (param: string[]) => {};
const handlePrnt = async (param: string[]) => {};
