import { WebSocket } from 'ws';
// import { localDataBase } from '../../local_data_base/local.data.base';
import { WebsocketTypes } from '../../enum/websocket.types';
import { localWinnersBase } from '../../local_data_base/local.winners.base';
import { updateRoom } from '../rooms/room.module';
// import {UserInterface} from "../../interface/user.interface";
import { User } from './user';
import { localDataBase } from '../../local_data_base/local.data.base';
import { UserInterface } from '../../interface/user.interface';
import { ReceivedDataInterface } from '../../interface/received.data.interface';

let userIndex = 0;

export const storeUserData = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
    currentUser: User,
) => {
    // console.log('receivedData', receivedData);
    const { data } = receivedData;
    const { name, password } = JSON.parse(data);

    // console.log('name', name);
    // console.log('password', password);

    if (typeof name === 'string' && typeof password === 'string') {
        // localDataBase.push({ name, password, wins: 0 });

        const data = {
            type: WebsocketTypes.REG,
            data: JSON.stringify({
                name,
                index: userIndex,
                error: false,
                errorText: '',
            }),
            id: 0,
        };

        ws.send(JSON.stringify(data));

        const user: UserInterface = {
            name,
            password,
            wins: 0,
            index: userIndex,
            ws,
        };

        currentUser.setCurrentPlayer(user);

        localDataBase.push(user);

        userIndex += 1;

        updateRoom(ws, currentUser);
        updateWinners(ws, receivedData);
    }
};

export const updateWinners = (ws: WebSocket, receivedData: any) => {
    console.log('receivedData', receivedData);

    const winnerTable = {
        type: WebsocketTypes.UPDATE_WINNERS,
        data: JSON.stringify(localWinnersBase),
        id: 0,
    };
    ws.send(JSON.stringify(winnerTable));
};
