import { updateRooms } from "./users";

import {
    ExtendedWebSocket,
    Game,
    Room,
    RoomModified,
    Rooms
} from "../types";

const rooms: Rooms = new Map();
let roomId: number = 1;

export const getAllFreeRoms = (): RoomModified[] => {
    const roomsArr: RoomModified[]  = [];

    rooms.forEach((value, key) => {
        if (value.secondPlayer) {
            return;
        }

        roomsArr.push({
            roomId: key,
            roomUsers: [{
                name: value.firstPlayer.name,
                index: value.firstPlayer.id
            }]
        })
    });

    return roomsArr;
}

export const createRoom = (firstPlayer: ExtendedWebSocket): void => {
    const id: number = roomId++;
    const room: Room = {
        id,
        firstPlayer,
        secondPlayer: null,
        game: null,
    };

    rooms.set(id, room);

    updateRooms();
}

export const getRoom = (id: number): Room => rooms.get(id);

export const getGame = (gameId: number): Game => {
    for (const room of rooms.values()) {
        if (room.game?.id === gameId) {
            return room.game;
        }
    }
}

export const removeRoom = (gameId: number): void => {
    let key: number;

    for (const entry of rooms.entries()) {
        if (entry[1].game?.id === gameId) {
            key = entry[0];
        }
    }

    if (key) {
        rooms.delete(key);
    }
}
