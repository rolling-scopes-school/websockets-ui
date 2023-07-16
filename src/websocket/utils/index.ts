import { players, rooms } from "../db/db";
import { PlayerType } from "../types";

const findPlayer = (userId: number) => players.find(({ playerId }) => playerId === userId);

const findPlayerInRoom = (userId: number) => {
    let result: PlayerType | undefined;
    rooms.forEach(({ players }) => {
        result = players.find(({ playerId }) => playerId === userId)
    })
    return result
}


export { findPlayer, findPlayerInRoom };