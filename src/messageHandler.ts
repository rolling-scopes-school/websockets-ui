import { RawData, WebSocket } from "ws";
import { getMousePos, moveMouse } from 'robotjs';
import { drawRectangle } from "./drawRectangle";
import { drawCircle } from "./drawCircle";

export const messageHandler = (data: RawData, instant: WebSocket) => {
  const dataString = data.toString();
  const [command, firstProp, secondProp] = dataString.split(' ');

  const [commandType, commandName] = command.split('_');

  const firstDigit = Number(firstProp);
  const secondDigit = Number(secondProp);

  const {x, y} = getMousePos();
  if(commandType === 'mouse') {
    switch(commandName) {
      case 'position':
        instant.send(`mouse_position ${x},${y}`)
        break;
      case 'up':
        moveMouse(x, y - firstDigit)
        break;
      case 'down':
        moveMouse(x, y + firstDigit)
        break;
      case 'left':
        moveMouse(x - firstDigit, y)
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


}