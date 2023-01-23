import { mouse, Point, Button } from '@nut-tree/nut-js';

export default async (startPosition, lenX, lenY) => {
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