import { RawData, WebSocket } from 'ws';

import { WebsocketTypes } from './enum/websocket.types';
import { storeUserData } from './modules/users/user.module';
import {
    addUserToRoom,
    createRoom,
    createRoomForSingleMode,
} from './modules/rooms/room.module';
import { User } from './modules/users/user';
import { addUserShips } from './modules/ships/ships';
import { playerAttack, randomAttack } from './modules/game/game.module';

const currentUser = new User();

export const requestHandler = (ws: WebSocket) => {
    try {
        ws.on('message', (data: RawData) => {
            const receivedData = JSON.parse(data.toString());
            const { type } = receivedData;

            switch (type) {
                case WebsocketTypes.REG: {
                    storeUserData(ws, receivedData, currentUser);
                    break;
                }

                case WebsocketTypes.CREATE_ROOM: {
                    createRoom(ws, currentUser);
                    break;
                }

                case WebsocketTypes.ADD_USER_TO_ROOM: {
                    addUserToRoom(ws, receivedData, currentUser);
                    break;
                }

                case WebsocketTypes.ADD_SHIPS: {
                    addUserShips(ws, receivedData);
                    break;
                }

                case WebsocketTypes.ATTACK: {
                    playerAttack(ws, receivedData);
                    break;
                }

                case WebsocketTypes.RANDOM_ATTACK: {
                    randomAttack(ws, receivedData);
                    break;
                }

                case WebsocketTypes.SINGLE_PLAY: {
                    createRoomForSingleMode(ws, currentUser);
                    break;
                }

                default: {
                    console.log('Not implemented');
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
};
