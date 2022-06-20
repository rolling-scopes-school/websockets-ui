import { ICommands } from './interfaces';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const reportError = ({ message }: { message: string }): void => {
  console.log('[error]', message);
};

export const prepareCommands = (inputCommand: string): ICommands => {
  const commandsString: string[] = inputCommand.split(' ');
  const [command]: string[] = commandsString;
  commandsString.shift();

  return {
    command,
    props: commandsString.map((prop: string) => Number(prop)),
  };
};
