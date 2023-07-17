import { updateDB } from "../../../index.js";

export const updateRoom = (ws) => {
    const DB = updateDB();
    //let userName = '';
    Object.keys(DB.players).forEach( playerName => {
        if (DB.players[playerName].ws === ws) {
            //userName = playerName;
            DB.rooms.push(
                {
                roomId: DB.rooms.length,
                roomUsers:
                    [
                        {
                            name: playerName,
                            index: ws.id,
                        }
                    ],
                }
            )
        }
    })

    const updRoomRes = {
        type: "update_room",
        data: JSON.stringify(DB.rooms),
        id: 0,
    };
    return [JSON.stringify(updRoomRes), true];
};
