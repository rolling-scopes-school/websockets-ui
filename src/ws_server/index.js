import { WebSocketServer } from 'ws';
import { mouse, left, right, up, down, straightTo, Point, Button } from '@nut-tree/nut-js';

const navigationCommands = {
  mouse_up: 'mouse_up',
  mouse_down: 'mouse_down',
  mouse_left: 'mouse_left',
  mouse_right: 'mouse_right',
  mouse_position: 'mouse_position',
  draw_circle: 'draw_circle',
  draw_rectangle: 'draw_rectangle',
  draw_square: 'draw_square',
  prnt_scrn: 'prnt_scrn'
}

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
  const step = 0.01;
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
      //await makeScreenshot();
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
});

wss.on('close', () => { console.log('Disconnected!') });
