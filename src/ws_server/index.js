import { WebSocketServer } from 'ws';
import { navigationCommands, screenshotSize } from './utils/const.js';
import { mouseDown, mouseLeft, mouseRight, mouseUp, drawCircle, drawRectangle, makeScreenshot, getPosition } from './commands/index.js';

const execCommand = async (inputCommand) => {
  let result = '';
  const arrParams = inputCommand.split(' ');
  const inputCommandName = arrParams[0];
  const offsetValue = +arrParams[1];

  const startPosition = await getPosition();

  switch (navigationCommands[inputCommandName]) {
    case navigationCommands.mouse_up:
      await mouseUp(offsetValue);
      result = offsetValue;
      break;
    case navigationCommands.mouse_right:
      await mouseRight(offsetValue);
      result = offsetValue;
      break;
    case navigationCommands.mouse_down:
      await mouseDown(offsetValue);
      result = offsetValue;
      break;
    case navigationCommands.mouse_left:
      await mouseLeft(offsetValue);
      result = offsetValue;
      break;
    case navigationCommands.mouse_position:
      result = `${startPosition.x}px,${startPosition.y}px`;
      break;
    case navigationCommands.draw_circle:
      await drawCircle(startPosition, offsetValue);
      result = offsetValue;
      break;
    case navigationCommands.draw_rectangle:
      await drawRectangle(startPosition, offsetValue, +arrParams[2]);
      result = `${offsetValue} ${arrParams[2]}`;
      break;
    case navigationCommands.draw_square:
      await drawRectangle(startPosition, offsetValue);
      result = offsetValue;
      break;
    case navigationCommands.prnt_scrn:
      result = await makeScreenshot(startPosition, screenshotSize, screenshotSize);
      break;
    default:
      console.log('Command not found');
      break;
  }

  return result;
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    const inputMessage = data.toString();
    const result = await execCommand(inputMessage);
    const commandName = inputMessage.split(' ')[0];
    ws.send(`${commandName} ${result}`);
  });

  ws.on('close', () => { console.log('Disconnected!') });
});
