import { DIRECTIONS, drawCircle, drawRect, getMousePosition, moveMouse, POSITION } from "./remote-exec";

enum COMMANDS {
  mouse = "mouse",
  draw = "draw",
  prnt = "prnt",
}

enum SHAPES {
  rect = 'rectangle',
  circle = 'circle',
  square = 'square'
}

const respPosition = 'mouse_position';

export const handleCommand = async (commandInput: string) => {
  let result: string = '';
  
  const [command, param, ...rest] = commandInput.split("_");
  
  if (rest.length) throw new Error("Wrong command");

  try {
    switch (command) {
      case COMMANDS.mouse:
        result = await handleMouse(param);
        break;
      case COMMANDS.draw:
        await handleDraw(param);
        break;
      case COMMANDS.prnt:
        await handlePrnt(param);
        break;
      default:
        throw new Error("Wrong command");
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
  return result;
};

const handleMouse = async (paramsInput: string) => {
  let result: string = '';
  const [direction, distance, ...rest] = paramsInput.split(" ").filter((item) => !!item.trim());
  if (rest.length) throw new Error("Invalid args");
  
  if (Object.keys(DIRECTIONS).includes(direction.trim()) 
    && distance !== undefined) {

    console.log(`move mouse to ${direction} for ${distance}px`);
    await moveMouse(direction, distance);

  }else if (direction === POSITION &&  distance === undefined){

      result = `${respPosition} ${await getMousePosition()}`;
    
   } else {

    throw new Error("Invalid args");

  }
  return result;
  
};

const handleDraw = async (paramsInput: string) => {
  const [shape, radius, height] = paramsInput.split(" ").filter((item) => !!item.trim());
  switch (shape) {
    case SHAPES.circle:
      if(radius) await drawCircle(radius);
      break;
    case SHAPES.rect:
      if(radius && height) await drawRect(radius, height);
      break;
    case SHAPES.square:
      if(radius) await drawRect(radius, radius);
      break;
    default:
      throw new Error("Invalid args");
  }
};
const handlePrnt = async (param: string) => {};
