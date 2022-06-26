import robot from 'robotjs';

export default async function circle(radius: number) {
  const mouse = robot.getMousePos();
  const xValues: number[] = [mouse.x];

  const yValues: number[] = [mouse.y];

  for (let i = 0; i < 360; i++) {
    xValues[i] = mouse.x + radius * Math.cos((2 * Math.PI * i) / 360);
    yValues[i] = mouse.y + radius * Math.sin((2 * Math.PI * i) / 360);
  }

  for (let i = 0; i < 360; i++) {
    const x: number | undefined = xValues[i];
    const y: number | undefined = yValues[i];
    if (x && y) {
      robot.dragMouse(x, y);
    }
  }
}
