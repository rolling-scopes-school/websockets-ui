declare const write: (data: string) => boolean;
declare const makeOperations: (msg: string, func?: any) => Promise<void>;
export { write, makeOperations };
