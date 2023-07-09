import WebSocket from "ws";

export enum Commands {
    Registration = "reg",
    CreateRoom = "create_room",
    CreateGame = "create_game",
    AddShip = "add_ships",
    UpdateRoom = "update_room",
    AddPlayer = "add_user_to_room",
    StartGame = "start_game",
    Attack = "attack",
    Turn = "turn",
    RandomAttack = "randomAttack",
    Finish = "finish",
}

export type Response = {
    id: number,
    type: Commands,
    data: string,
}

export interface ExtendedWebSocket extends WebSocket {
    id: number,
    name: string,
    password: string,
}

export type User = {
    name: string,
    password: string,
    socket: ExtendedWebSocket,
    inGame: boolean,
}

export type Room = {
    id: number,
    firstPlayer: ExtendedWebSocket,
    secondPlayer: ExtendedWebSocket,
    game: Game,
}

export type RoomModified = {
    roomId: number,
    roomUsers: {
        name: string,
        index: number,
    }[],
}

export type Game = {
    id: number,
    firstUser: ExtendedWebSocket,
    secondUser: ExtendedWebSocket,
    firstShips: Ship[],
    secondShips: Ship[],
    firstShots: Position[],
    secondShots: Position[],
    currentPlayer: number,
    isFinished: boolean,
}

export type Ship = {
    isKilled: boolean,
    points: PositionStatus[],
}


export type Position = {
    x: number,
    y: number,
}

export interface PositionStatus extends Position {
    status: boolean,
}
