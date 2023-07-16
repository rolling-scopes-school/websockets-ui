import { WebSocket } from "ws";
import { findPlayer, findPlayerInCurrentRoom, findRoom } from "./utils";
import { PlayerType, RoomType } from "./types";
import { createGame } from "./createGame";
import { updateRooms } from "./updateRooms";


function addUser(ws: WebSocket, data: string, userId: number) {
    const { indexRoom: roomId } = JSON.parse(data);

    const room = findRoom(parseInt(roomId));
    const player = findPlayer(userId)

    if (findPlayerInCurrentRoom(room as RoomType, userId)) {
        const responce = {
            type: 'error',
            data: {
                error: true,
                errorMessage: 'user already in room'
            },
            index: 0
        };

        player?.wsObject.send(JSON.stringify(responce));
    } else {
        room?.players.push(player as PlayerType);
        updateRooms()
        createGame(room as RoomType);
    }


}

export { addUser };