import { updateDB } from "../../../index.js";
import WebSocket from "ws";

export const addUserToRoom = (data, ws, wss) => {
    const DB = updateDB();
    const reqRoomIndex = data.indexRoom;
    let readyToPlay = [];

    DB.rooms.forEach((room, i) => {
        if (room.roomId === reqRoomIndex) {
            DB.rooms[i].roomUsers.push({name : ws.name, index : ws.id});
            readyToPlay = [DB.rooms[i].roomUsers[0].index, DB.rooms[i].roomUsers[1].index];
        }
        if (room.roomId !== reqRoomIndex && room.roomUsers[0].name === ws.name) {
            arr.splice(i);
        }
    })
    
    updateDB(DB);

    wss.clients.forEach( client => {
        if (client.readyState === WebSocket.OPEN && client.id === readyToPlay[0]){
            const req = {
                type: "create_game", //send for both players in the room
                data: JSON.stringify(
                    {
                        idGame: reqRoomIndex,  
                        idPlayer: readyToPlay[1], /*player id in the game */
                    }),
                id: 0,
            };
            client.send(JSON.stringify(req));
        };
        if (client.readyState === WebSocket.OPEN && client.id === readyToPlay[1]){
            const req = {
                type: "create_game", //send for both players in the room
                data:JSON.stringify(
                    {
                        idGame: reqRoomIndex,  
                        idPlayer: readyToPlay[0], /*player id in the game */
                    }),
                id: 0,
            };
            client.send(JSON.stringify(req));
        }
    })

    const updRoomRes = {
        type: "update_room",
        data: JSON.stringify(DB.rooms.filter( room => {
            room.roomUsers.length < 2; 
        })),
        id: 0,
    };
    return [JSON.stringify(updRoomRes), true];
}
