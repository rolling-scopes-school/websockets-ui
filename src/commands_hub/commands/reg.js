import { dbWorker } from "../inMemoryDB.js";
import { updateDB } from "../../../index.js";

export const registration = (data, id, ws) => {
    const userName = data.name;
    const userPassword = data.password;
    const DB = updateDB();
    const playersDB = DB.players;
    if(playersDB[userName] === undefined) {
        const userID = ws.id;
        ws.name = userName;
        playersDB[userName] = {userPassword, userID, ws};
        updateDB(DB);
        const regRes = {
            type: 'reg',
            data: JSON.stringify(
                {
                    name: userName,
                    index: id,
                    error: false,
                    errorText: '',
                }),
            id: 0,        
        }
        return [JSON.stringify(regRes), false];
    } else if (playersDB[userName].userPassword === userPassword) {
        const regRes = {
            type: 'reg',
            data: JSON.stringify(
                {
                    name: userName,
                    index: id,
                    error: false,
                    errorText: '',
                }),
            id: 0,   
        }
        return [JSON.stringify(regRes), false];
    } else {
        const regRes = {
            type: 'reg',
            data: JSON.stringify(
                {
                    name: userName,
                    index: id,
                    error: true,
                    errorText: 'password is incorrect',
                }),
            id: 0,   
        }
        return [JSON.stringify(regRes), false];
    }
    
}