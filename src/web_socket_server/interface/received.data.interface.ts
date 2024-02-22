import { WebsocketTypes } from '../enum/websocket.types';

export interface ReceivedDataInterface {
    type: WebsocketTypes;
    data: string;
    id: number;
}

export interface IAttackData {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
}
