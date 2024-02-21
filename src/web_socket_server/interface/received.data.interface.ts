import { WebsocketTypes } from '../enum/websocket.types';

export interface ReceivedDataInterface {
    type: WebsocketTypes;
    data: string;
    id: number;
}
