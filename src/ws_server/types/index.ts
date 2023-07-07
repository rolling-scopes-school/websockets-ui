import WebSocket from "ws";
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

export interface ExtWebSocket extends WebSocket {
    index: number,
    userName: string,
    password: string,
    isGame: boolean,
    ships: Ship[]
}

export interface Room {
    playerOne: ExtWebSocket,
    playerTwo: ExtWebSocket,
}

export interface Games {
    [index: number]: Game;
}

export interface AttackData {
    gameID: number,
    x: number,
    y: number,
    indexPlayer: number,
}

export interface Game {
    playerOne: ExtWebSocket;
    playerTwo: ExtWebSocket;
    shotPlayer: ExtWebSocket;
    idRoom: number;
    addPLayer(wsClient: ExtWebSocket): void;
    addShip(ships: Ship[], indexPLayer: number): void

}