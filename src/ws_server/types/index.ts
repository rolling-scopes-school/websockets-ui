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

export type typeShip = "small" | "medium" | "large" | "huge"

export interface Ship {
    position: ShipPosition,
    direction: boolean,
    length: number,
    type: typeShip,
    rest: number;
}

export type ShipPosition = {
    x: number,
    y: number,
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
    ships: Ship[],
    attackCell: ShipPosition[]
}

export interface Player {
    index: number,
    userName: string,
    password: string,
    ships: Ship[],
    attackCell: ShipPosition[],
    socket?: WebSocket
}

export interface Room {
    playerOne: ExtWebSocket,
    playerTwo: ExtWebSocket,
}

export interface Games {
    [index: number]: Game;
}

export interface AttackData {
    gameId: number,
    x: number,
    y: number,
    indexPlayer: number,
}

export interface Game {
    playerOne: Player;
    playerTwo: Player;
    shotPlayer: Player;
    idRoom: number;
    addPLayer(wsClient: Player): void;
    addShip(ships: Ship[], indexPLayer: number): void;
    randomAttack(indexPLayer: number): void;
    attack(attackData: AttackData): void

}

export interface RandomAttackData {
    gameId: number,
    indexPlayer: number
}
export type resultAttack = "miss" | "killed" | "shot";

export interface cellShip {
    xCoor: number[];
    yCoor: number[];
}
