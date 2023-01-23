import { mouse, straightTo, Point, Button } from '@nut-tree/nut-js';
import { circleDrawStep } from '../utils/const.js';

export default async (startPosition, radius) => {
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