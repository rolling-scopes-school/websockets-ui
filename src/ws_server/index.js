import { WebSocketServer } from 'ws';
import { mouse, left, right, up, down, screen, straightTo, Point, Button, Region } from '@nut-tree/nut-js';
import Jimp from "jimp";
import { circleDrawStep, navigationCommands, screenshotSize } from './utils/const.js';

const drawRectangle = async (startPosition, lenX, lenY) => {
  if (lenY) {
    await mouse.drag([new Point(startPosition.x, startPosition.y), new Point(startPosition.x + lenX, startPosition.y)]);
    await mouse.drag([new Point(startPosition.x + lenX, startPosition.y), new Point(startPosition.x + lenX, startPosition.y + lenY)]);
    await mouse.drag([new Point(startPosition.x + lenX, startPosition.y + lenY), new Point(startPosition.x, startPosition.y + lenY)]);
    await mouse.drag([new Point(startPosition.x, startPosition.y + lenY), new Point(startPosition.x, startPosition.y)]);
  }
  else {
    await mouse.drag([new Point(startPosition.x, startPosition.y), new Point(startPosition.x + lenX, startPosition.y)]);
    await mouse.drag([new Point(startPosition.x + lenX, startPosition.y), new Point(startPosition.x + lenX, startPosition.y + lenX)]);
    await mouse.drag([new Point(startPosition.x + lenX, startPosition.y + lenX), new Point(startPosition.x, startPosition.y + lenX)]);
    await mouse.drag([new Point(startPosition.x, startPosition.y + lenX), new Point(startPosition.x, startPosition.y)]);
  }

  await mouse.releaseButton(Button.LEFT);
}

const drawCircle = async (startPosition, radius) => {
  const step = circleDrawStep;
  const positionX = startPosition.x + radius;
  const limit = Math.PI * 2;

  await mouse.pressButton(Button.LEFT);

  for (let i = 0; i <= limit; i += step) {
    const x = positionX - radius * Math.cos(i);
    const y = startPosition.y - radius * Math.sin(i);

    await mouse.move(straightTo(new Point(x, y)));
  }

  await mouse.releaseButton(Button.LEFT);
}

const makeScreenshot = async (startPosition, size) => {
  try {
    const region = new Region(startPosition.x, startPosition.y, size, size);

    await screen.highlight(region);

    const grabedRegion = await screen.grabRegion(region);
    const rgbImage = await grabedRegion.toRGB();
    const image = new Jimp(size, size);

    image.bitmap.data = rgbImage.data;
    image.bitmap.width = size;
    image.bitmap.height = size;

    const base64String = await image.getBase64Async(Jimp.MIME_PNG);

    return base64String.replace("data:image/png;base64,", "");
  } 
  catch {
    return undefined;
  }
}

const execCommand = async (inputCommand) => {
  let result = '';
  const arrParams = inputCommand.split(' ');
  const { x: currentX, y: currentY } = await mouse.getPosition();
  const startPosition = {
    x: currentX,
    y: currentY
  };

  switch (navigationCommands[arrParams[0]]) {
    case navigationCommands.mouse_up:
      await mouse.move(up(+arrParams[1]));
      result = arrParams[1];
      break;
    case navigationCommands.mouse_right:
      await mouse.move(right(+arrParams[1]));
      result = arrParams[1];
      break;
    case navigationCommands.mouse_down:
      await mouse.move(down(+arrParams[1]));
      result = arrParams[1];
      break;
    case navigationCommands.mouse_left:
      await mouse.move(left(+arrParams[1]));
      result = arrParams[1];
      break;
    case navigationCommands.mouse_position:
      result = `${startPosition.x}px,${startPosition.y}px`;
      break;
    case navigationCommands.draw_circle:
      await drawCircle(startPosition, +arrParams[1]);
      result = arrParams[1];
      break;
    case navigationCommands.draw_rectangle:
      await drawRectangle(startPosition, +arrParams[1], +arrParams[2]);
      result = `${arrParams[1]} ${arrParams[2]}`;
      break;
    case navigationCommands.draw_square:
      await drawRectangle(startPosition, +arrParams[1]);
      result = arrParams[1];
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

    ws.send(`${inputMessage.split(' ')[0]} ${result}`);
  });

  ws.on('close', () => { console.log('Disconnected!') });
});
