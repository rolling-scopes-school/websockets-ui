import { RawData, WebSocket } from "ws";
import { getMousePos, moveMouse, mouseToggle } from 'robotjs';
import { drawRectangle } from "./drawRectangle";

export const messageHandler = (data: RawData, instant: WebSocket) => {
  const dataString = data.toString();
  const [command, firstProp, secondProp] = dataString.split(' ');

  const [commandType, commandName] = command.split('_');

  const {x, y} = getMousePos();
  if(commandType === 'mouse') {
    switch(commandName) {
      case 'position':
        instant.send(`mouse_position ${x},${y}`)
        break;
      case 'up':
        moveMouse(x, y - Number(firstProp))
        break;
      case 'down':
        moveMouse(x, y + Number(firstProp))
        break;
      case 'left':
        moveMouse(x - Number(firstProp), y)
        break;
      case 'right':
        moveMouse(x + Number(firstProp), y)
        break;
    }
  } 

  if(commandType === 'draw') {
    switch(commandName) {
      case 'square':
        drawRectangle({
          coordinates: {x, y},
          bias: {x: Number(firstProp)}
        })
        break;
      
      case 'rectangle': {
        drawRectangle({
          coordinates: {x, y},
          bias: {
            x: Number(firstProp), 
            y: Number(secondProp)
          }
        })
      }
    }
  }


}