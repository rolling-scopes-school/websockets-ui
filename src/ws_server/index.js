import { WebSocketServer } from 'ws';
import { mouse, left, right, up, down, Point, straightTo, Button } from '@nut-tree/nut-js';

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
  if(lenY) {
    await mouse.drag([new Point(startPosition.x, startPosition.y), new Point(startPosition.x+lenX, startPosition.y)]);
    await mouse.drag([new Point(startPosition.x+lenX, startPosition.y), new Point(startPosition.x+lenX, startPosition.y+lenY)]);
    await mouse.drag([new Point(startPosition.x+lenX, startPosition.y+lenY), new Point(startPosition.x, startPosition.y+lenY)]);
    await mouse.drag([new Point(startPosition.x, startPosition.y+lenY), new Point(startPosition.x, startPosition.y)]);   
  }
  else {
    await mouse.drag([new Point(startPosition.x, startPosition.y), new Point(startPosition.x+lenX, startPosition.y)]);
    await mouse.drag([new Point(startPosition.x+lenX, startPosition.y), new Point(startPosition.x+lenX, startPosition.y+lenX)]);
    await mouse.drag([new Point(startPosition.x+lenX, startPosition.y+lenX), new Point(startPosition.x, startPosition.y+lenX)]);
    await mouse.drag([new Point(startPosition.x, startPosition.y+lenX), new Point(startPosition.x, startPosition.y)]);
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
  const arrParams = inputCommand.split(' ');

  const { x: currentX, y: currentY } = await mouse.getPosition();
  const startPosition = {
    x: currentX,
    y: currentY
  };

  switch (navigationCommands[arrParams[0]]) {
    case navigationCommands.mouse_up:
      await mouse.move(up(+arrParams[1]));
      break;
    case navigationCommands.mouse_right:
      await mouse.move(right(+arrParams[1]));
      break;
    case navigationCommands.mouse_down:
      await mouse.move(down(+arrParams[1]));
      break;
    case navigationCommands.mouse_left:
      await mouse.move(left(+arrParams[1]));
      break;
    case navigationCommands.mouse_position:
      await mouse.setPosition(startPosition);
      break;
    case navigationCommands.draw_circle:
      await drawCircle(startPosition, +arrParams[1]);
      break;
    case navigationCommands.draw_rectangle:
      await drawRectangle(startPosition, +arrParams[1], +arrParams[2]);
      break;
    case navigationCommands.draw_square:
      await drawRectangle(startPosition, +arrParams[1]);
      break;
    case navigationCommands.prnt_scrn:
      console.log('arrParams: ', arrParams);
      break;
    default:
      console.log('Command not found');
      break;
  }
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  ws.on('message', function message(data) {
    execCommand(data.toString());
  });
});

wss.on('close', () => { console.log('Disconnected!')});
