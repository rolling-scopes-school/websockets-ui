import { Button, mouse, Point } from '@nut-tree/nut-js';

const drawLine = async (destination: Point[]): Promise<void> => {
  await mouse.pressButton(Button.LEFT);

  await mouse.move(destination);

  await mouse.releaseButton(Button.LEFT);
};

export default drawLine;
