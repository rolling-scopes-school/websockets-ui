import { registration } from "./commands/reg.js";
import { createGame } from "./commands/create_game.js";
import { updateRoom } from "./commands/update_room.js";

export const commandRouter = (command) => {
    const type = command.type;
    console.log('input command:', command);
    let data = '';
    if (command.data !== '') {
        data = JSON.parse(command.data);
    }
    
    const id = command.id;
    switch (type) {
        // PLAYER COMMANDS //
        case 'reg': {
            return registration(data, id);
            
        }

        case 'update_winners':
            break;
            //return updateWinners(data);

        // ROOM COMMANDS //
        case 'create_room':
            return updateRoom();
            
        case 'add_player_to_room':
            console.log(data);
            break;  

        default:
            break;
    }
};