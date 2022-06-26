import { stdout } from 'process';
import { EOL } from 'os';

const write = (data: string) => stdout.write(`${data}${EOL}`);

const writeCommandOutput = (data: string) =>
  stdout.write(`${data} successed${EOL}\0`);

const makeOperations = async (msg: string, func?: any) => {
  try {
    if (func) func;
    await writeCommandOutput(msg);
  } catch (err) {
    const errmsg = JSON.stringify(err, null, 2);
    writeCommandOutput(errmsg);
  }
};

const createClietCommand = (command: string) => `${command}\0`;

export { write, makeOperations, createClietCommand };
