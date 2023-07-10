import { updateDB } from "../../../index.js";

export const createGame  = () => {
    const DB = updateDB();
    const crtGameRes = {
        type: "create_game",
        data: JSON.stringify(
            {
                idGame: 123,
                idPlayer: DB.players['123123'].UUID,
            }
        ),
        id: 0,
    };
    return JSON.stringify(crtGameRes);
}