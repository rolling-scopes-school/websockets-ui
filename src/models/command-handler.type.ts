import {Duplex} from "stream";

export type CommandHandler = (
    ...args: [string[], Duplex]
) => Promise<string>;
