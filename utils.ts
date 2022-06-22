import { ICommands } from './interfaces';
import { IncomingMessage } from 'http';

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

export const showWebSocketInfo = (request: IncomingMessage): void => {
  const { headers } = request;

  console.log('client info');
  console.table({
    host: headers.host ? headers.host : '',
    connection: headers.connection ? headers.connection : '',
    upgrade: headers.upgrade ? headers.upgrade : '',
    'user-agent': headers['user-agent'] ? headers['user-agent'] : '',
  });
  console.log('client connected');
};

export const showCommands = (inputCommand: string): void => {
  console.log('<-' + inputCommand);
};
