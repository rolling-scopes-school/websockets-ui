export interface IWS {
  on: (event: string, fn: (data: Buffer) => void) => void;
  send: (message: string | Buffer) => void;
}

export interface IDuplex {
  on: (event: string, fn: (data: Buffer) => void) => void;
  write: (message: string | Buffer) => void;
}

export interface IMousePosition {
  x: number;
  y: number;
}

export interface ICommands {
  command: string;
  props: number[];
}
