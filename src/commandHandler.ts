import robot from 'robotjs';

export const commandHandler = (command: string, args: Array<String>) => {
  const { x, y } = robot.getMousePos();
  switch (command) {
    case 'mouse_up':
      robot.moveMouse(x, y - Number(args[0]));
      break;
    case 'mouse_down':
      robot.moveMouse(x, y + Number(args[0]));
      break;
    case 'mouse_left':
      robot.moveMouse(x - Number(args[0]), y);
      break;
    case 'mouse_right':
      robot.moveMouse(x + Number(args[0]), y);
      break;
    default:
      console.log('Unknown command:', command);
  }
};
