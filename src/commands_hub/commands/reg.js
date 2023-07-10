import { dbWorker } from "../inMemoryDB.js";
import { updateDB } from "../../../index.js";
import { randomUUID } from "crypto";

export const registration = (data, id) => {
    const userName = data.name;
    const userPassword = data.password;
    //const playersDB =  dbWorker().players;
    const DB = updateDB();
    const playersDB = DB.players;
    if(playersDB[userName] === undefined) {
        const UUID = randomUUID();
        playersDB[userName] = {userPassword, UUID};
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
    } else if (playersDB[userName] === userPassword) {
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