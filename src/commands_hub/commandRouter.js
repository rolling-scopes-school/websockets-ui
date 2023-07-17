import { registration } from "./commands/reg.js";
import { createGame } from "./commands/create_game.js";
import { updateRoom } from "./commands/update_room.js";
import { addUserToRoom } from "./commands/add_user.js";
import { addShipsToBoard } from "./commands/add_ships.js"

export const commandRouter = (command, wss, ws) => {
    const type = command.type;
    let data = '';
    if (command.data !== '') {
        data = JSON.parse(command.data);
    }
    
    const id = command.id;
    switch (type) {
        // PLAYER COMMANDS //
        case 'reg': {
            return registration(data, id, ws);
            
        }

        case 'update_winners':
            break;
            //return updateWinners(data);

        // ROOM COMMANDS //
        case 'create_room':
            return updateRoom(ws);
            
        case 'add_user_to_room':
            return addUserToRoom(data, ws, wss);  

        // SHIPS COMMANDS //
        case 'add_ships':
            return addShipsToBoard(data)
        default:
            break;
    }
};