import { WebSocket } from "ws"
import { rooms, players } from "./db/db"


function updateRooms() {
    players.forEach((player) => {

        const data = rooms.map(room => {
            const roomId = room.id;
            const roomUsers = room.players.map(player => ({
                'index': player.playerId,
                "name": player.name
            }))
            return { roomId, roomUsers }
        });

        const responce = {
            type: "update_room",
            data: JSON.stringify(data),
            id: 0,
        };

        player.wsObject.send(JSON.stringify(responce))
    }
    )

}

export { updateRooms };