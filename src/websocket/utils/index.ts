import { players, rooms } from "../db/db";
import { PlayerType, RoomType } from "../types";

const findPlayer = (userId: number) => players.find(({ playerId }) => playerId === userId);

const findPlayerInRoom = (userId: number) => {
    let result: PlayerType | undefined;
    rooms.forEach(({ players }) => {
        result = players.find(({ playerId }) => playerId === userId)
    })
    return result
};

const findRoom = (roomId: number) => rooms.find(({ id }) => id === roomId)

const findPlayerInCurrentRoom = (room: RoomType, userId: number) => room?.players?.find((player) => player.playerId === userId)



export { findPlayer, findPlayerInRoom, findRoom, findPlayerInCurrentRoom };