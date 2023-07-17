import { updateDB } from "../../../index.js";

export const addShipsToBoard = (data) => {
    console.log(data);
    const DB = updateDB();
    DB.games[data.gameId][0] = data.ships;

    updateDB(DB);

    const res = {
        type: "start_game",
        data: JSON.stringify(
            {
            ships: data.ships,
            currentPlayerIndex: data.id, /* id of the player in the current game who have sent his ships */
        }),
        id: 0,
    };
    return JSON.stringify(res);
}