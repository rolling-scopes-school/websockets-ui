import { WebSocket } from "ws";
import { RoomType } from "./types";
import { findPlayer } from "./utils";


function createGame(room: RoomType) {
    const { players, id: roomId } = room;

    players.forEach(({ wsObject, playerId }) => {
        const response = {
            type: "create_game",
            data: JSON.stringify({
                idGame: roomId,
                idPlayer: playerId
            }),
            id: 0
        };
        wsObject.send(JSON.stringify(response), (err) => err && console.log(err))
    })

}

export { createGame };

