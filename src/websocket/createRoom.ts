import { WebSocket } from "ws"

import { players, rooms } from "./db/db";
import { PlayerType } from "./types";
import { findPlayer, findPlayerInRoom } from "./utils";






function createRoom(wsSended: WebSocket, data: string, userId: number) {
    const generateId: number = new Date().valueOf() + rooms.length;
    const user = findPlayer(userId);
    const roomPlayer = findPlayerInRoom(userId);

    // check for if user already create room 
    if (roomPlayer) {
        const responce = {
            type: "error",
            data: {
                name: userId.toString(),
                index: userId,
                error: true,
                errorText: 'player already create room',
            },
            id: 0,
        }
        wsSended.send(JSON.stringify(responce))

    } else {
        // add to rooms db new room 
        rooms.push({
            id: generateId,
            players: [user as PlayerType]
        },)
    }
}

export { createRoom }