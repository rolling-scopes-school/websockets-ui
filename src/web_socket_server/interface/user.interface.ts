import { WebSocket } from 'ws';

export interface UserInterface {
    name: string;
    password: string;
    index: number;
    ws?: WebSocket;
    wins?: number;
    playWithBot?: boolean;
}
