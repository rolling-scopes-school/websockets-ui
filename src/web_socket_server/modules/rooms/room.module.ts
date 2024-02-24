import { WebSocket } from 'ws';

import { WebsocketTypes } from '../../enum/websocket.types';
import { User } from '../users/user';
import { localListOfUsersRooms } from '../../local_data_base/local.list.of.users.rooms';
import { localDataBase } from '../../local_data_base/local.data.base';
import { ReceivedDataInterface } from '../../interface/received.data.interface';
import { getWsSendData } from '../../utils/stringify.data';

let roomIdCount = 1;
const gameId = 1;

export const createRoom = (ws: WebSocket) => {
    const wsData = getWsSendData(
        [
            {
                roomId: roomIdCount,
                roomUsers: [],
            },
        ],
        WebsocketTypes.UPDATE_ROOM,
    );

    roomIdCount += 1;

    ws.send(wsData);
};

export const updateRoom = (
    ws: WebSocket,
    currentUser: User,
    indexRoom?: number,
) => {
    if (indexRoom) {
        const getCurrentRoomIndex = localListOfUsersRooms.findIndex(
            (room) => room.roomId === indexRoom,
        );

        if (getCurrentRoomIndex !== -1) {
            const room = localListOfUsersRooms.splice(getCurrentRoomIndex, 1);
            const firstPlayerId = room[0]?.roomUsers[0]?.index;
            const firstPlayer = localDataBase.find(
                (player) => player.index === firstPlayerId,
            );

            const user = currentUser.getCurrentPlayer();
            const data = {
                idGame: gameId,
                idPlayer: user.index,
            };

            let wsData = getWsSendData(
                {
                    ...data,
                    idPlayer: firstPlayerId,
                },
                WebsocketTypes.CREATE_GAME,
            );

            firstPlayer!.ws?.send(wsData);

            wsData = getWsSendData(data, WebsocketTypes.CREATE_GAME);

            ws.send(wsData);

            const wsUpdateRoomData = getWsSendData(
                localListOfUsersRooms,
                WebsocketTypes.UPDATE_ROOM,
            );

            firstPlayer?.ws?.send(wsUpdateRoomData);

            return ws.send(wsUpdateRoomData);
        }

        const player = currentUser.getCurrentPlayer();
        localListOfUsersRooms.push({
            roomId: indexRoom,
            roomUsers: [
                {
                    name: player.name,
                    index: player.index,
                },
            ],
        });
    }

    ws.send(
        JSON.stringify({
            type: WebsocketTypes.UPDATE_ROOM,
            data: JSON.stringify(localListOfUsersRooms),
            id: 0,
        }),
    );
};

export const addUserToRoom = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
    currentUser: User,
) => {
    const { data } = receivedData;
    const { indexRoom } = JSON.parse(data);

    updateRoom(ws, currentUser, indexRoom);
};
