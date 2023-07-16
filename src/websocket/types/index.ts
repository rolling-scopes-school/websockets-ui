import { WebSocket } from 'ws';

export type PlayerType = {
    playerId: number;
    name: string;
    password: string;
    wsObject: any;
}

export type RoomType = {
    id: number;
    players: PlayerType[];
}