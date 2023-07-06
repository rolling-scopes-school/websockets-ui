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

export interface FrontRoomData {
    indexRoom: number,
}

export interface FrontShipAdd {

    gameId: number,
    ships: Ship[],
    indexPlayer: number,
}

export interface Ship {
    position: {
        x: number,
        y: number,
    },
    direction: boolean,
    length: number,
    type: "small" | "medium" | "large" | "huge",
}

export interface ServerRegData {
    name: string,
    index: number,
    error: boolean,
    message: string,
}