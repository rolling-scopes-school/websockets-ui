import { mouseToggle, moveMouse } from "robotjs";

import { DrawRectangleType } from "../types";

const drawRectangle = ({
  coordinates: {x, y},
  bias, 
}:DrawRectangleType) => {
  const { x: biasX, y: biasY } = {x: bias.x, y: bias.y || bias.x}

  mouseToggle('down');

  moveMouse(x + Number(biasX), y);
  moveMouse(x + Number(biasX), y + Number(biasY));
  moveMouse(x, y + Number(biasY));
  moveMouse(x, y);

  mouseToggle('up');

}

export default drawRectangle;