export const parseCommand = (command: string) => {
  const args = command.split(' ');
  const commandName = args.shift();

  const coordinates = args.map((arg) => parseInt(arg, 10));

  return { commandName, coordinates };
};
