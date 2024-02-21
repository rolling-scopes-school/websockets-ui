import { WebSocket } from 'ws';
// import { localListOfUsersRooms } from '../local_data_base/local.list.of.users.rooms';
import { WebsocketTypes } from '../../enum/websocket.types';
// import { localDataBase } from '../../local_data_base/local.data.base';
import { User } from '../users/user';
import { localListOfUsersRooms } from '../../local_data_base/local.list.of.users.rooms';
import { localDataBase } from '../../local_data_base/local.data.base';
import { ReceivedDataInterface } from '../../interface/received.data.interface';

let roomIdCount = 1;
const gameId = 1;
// const listOfRooms = [];

export const createRoom = (ws: WebSocket) => {
    // console.log('receivedData', receivedData);
    // console.log('ws', ws);

    const data = [
        {
            roomId: roomIdCount,
            roomUsers: [],
        },
    ];

    roomIdCount += 1;

    ws.send(
        JSON.stringify({
            type: WebsocketTypes.UPDATE_ROOM,
            data: JSON.stringify(data),
            id: 0,
        }),
    );
};

export const updateRoom = (
    ws: WebSocket,
    currentUser: User,
    indexRoom?: number,
) => {
    // console.log('receivedData', receivedData);

    if (indexRoom) {
        const getCurrentRoomIndex = localListOfUsersRooms.findIndex(
            (room) => room.roomId === indexRoom,
        );
        // console.log('getCurrentRoomIndex', getCurrentRoomIndex);

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

            if (!firstPlayer!.ws) {
                return;
            }

            firstPlayer?.ws.send(
                JSON.stringify({
                    type: WebsocketTypes.CREATE_GAME,
                    data: JSON.stringify({
                        ...data,
                        idPlayer: firstPlayerId,
                    }),
                    id: 0,
                }),
            );

            ws.send(
                JSON.stringify({
                    type: WebsocketTypes.CREATE_GAME,
                    data: JSON.stringify(data),
                    id: 0,
                }),
            );

            firstPlayer?.ws.send(
                JSON.stringify({
                    type: WebsocketTypes.UPDATE_ROOM,
                    data: JSON.stringify(localListOfUsersRooms),
                    id: 0,
                }),
            );

            return ws.send(
                JSON.stringify({
                    type: WebsocketTypes.UPDATE_ROOM,
                    data: JSON.stringify(localListOfUsersRooms),
                    id: 0,
                }),
            );
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
