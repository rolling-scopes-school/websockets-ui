import { COMMANDS } from "./enum";

export interface FrontR {
    type: COMMANDS,
    data: string,
    id: number,
}

export interface FrontRegData {
    name: string,
    password: string,
}

export interface ServerRegData {
    name: string,
    index: number,
    error: boolean,
    message: string,
}