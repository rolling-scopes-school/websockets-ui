import { mouseToggle, moveMouse } from "robotjs";

import { Coordinates } from "../types";

const STEP = 0.02;

const drawCircle = (coordinates:Coordinates, radius: number) => {

  for (let i = 0; i <= Math.PI * 2; i += STEP) {
    if(i === STEP) {
      mouseToggle('down')
    };

    const x = coordinates.x + (radius * Math.cos(i));
    const y = coordinates.y + (radius * Math.sin(i));
    moveMouse(x, y);
  };

  mouseToggle('up');

}

export default drawCircle;