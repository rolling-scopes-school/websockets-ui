import { WebSocket } from 'ws';

export type PlayerType = {
    playerId: number;
    name: string;
    password: string;
    wsObject: WebSocket;
}

export type RoomType = {
    id: number;
    players: PlayerType[];
}