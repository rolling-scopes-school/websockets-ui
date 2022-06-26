import { RawData } from "ws";
import { getMousePos, moveMouse } from 'robotjs';

import { drawRectangle, drawCircle, prntScreen } from "./utils";

export const messageHandler = async (data: RawData) => {
  const dataString = data.toString();
  const [command, firstProp, secondProp] = dataString.split(' ');

  const [commandType, commandName] = command.split('_');
  const firstDigit = Number(firstProp);
  const secondDigit = Number(secondProp);

  const {x, y} = getMousePos();

  let payload:string;

  if(commandType === 'mouse') {
    switch(commandName) {
      case 'position':
        payload = `${x},${y}`;
        break;
      case 'up':
        moveMouse(x, y - firstDigit);
        break;
      case 'down':
        moveMouse(x, y + firstDigit);
        break;
      case 'left':
        moveMouse(x - firstDigit, y);
        break;
      case 'right':
        moveMouse(x + firstDigit, y)
        break;
    }
  } 

  if(commandType === 'draw') {
    switch(commandName) {
      case 'square':
        drawRectangle({
          coordinates: {x, y},
          bias: {x: firstDigit}
        })
        break;
      
      case 'rectangle': 
        drawRectangle({
          coordinates: {x, y},
          bias: {
            x: firstDigit, 
            y: secondDigit,
          }
        })
        break;
      
      case 'circle': 
        drawCircle({x, y}, firstDigit)
        break;
    }
  }

  if(commandType === 'prnt') {
    const base64 = await prntScreen({x, y});
    payload = base64;
  }

  return `${commandType}_${commandName} ${payload || ''} \0`;
}