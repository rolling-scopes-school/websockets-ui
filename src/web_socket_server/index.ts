import { RawData, WebSocket, WebSocketServer } from 'ws';

import { WebsocketTypes } from './enum/websocket.types';
import { storeUserData } from './modules/users/user.module';
import { addUserToRoom, createRoom } from './modules/rooms/room.module';
import { User } from './modules/users/user';
import { addUserShips } from './modules/ships/ships';
import { playerAttack } from './modules/game/game.module';

const wss = new WebSocketServer({ port: 3000 });
const currentUser = new User();

console.log('Start WebSocket server on the 3000 port!');

process.on('uncaughtException', () => {
    console.log('Internal server error');
});

wss.on('connection', function connection(ws: WebSocket) {
    ws.on('error', console.error);

    ws.on('message', (data: RawData) => {
        const receivedData = JSON.parse(data.toString());
        const { type } = receivedData;

        switch (type) {
            case WebsocketTypes.REG: {
                storeUserData(ws, receivedData, currentUser);
                break;
            }

            case WebsocketTypes.CREATE_ROOM: {
                createRoom(ws);
                break;
            }

            case WebsocketTypes.ADD_USER_TO_ROOM: {
                addUserToRoom(ws, receivedData, currentUser);
                break;
            }

            case WebsocketTypes.ADD_SHIPS: {
                addUserShips(ws, receivedData, currentUser);
                break;
            }

            case WebsocketTypes.ATTACK: {
                playerAttack(ws, receivedData);
                break;
            }

            case WebsocketTypes.RANDOM_ATTACK: {
                // randomAttack(ws, receivedData, currentUser);
                break;
            }

            default: {
                console.log('Not implemented');
            }
        }
    });
});
