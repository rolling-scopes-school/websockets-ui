import { WebSocket } from "ws"
import crypto from 'crypto'
import { players } from "./db/db";
import { PlayerType } from "./types";


interface IPlayerData {
    password: string;
    name: string;
    id: number
}

function isPlayerExists(name: string): boolean {
    const filteredPlayers = players.filter((player) => player.name === name)
    return filteredPlayers[0] ? true : false
}

function registerPlayer(ws: WebSocket, dataReceived: string, playerId: number) {
    const parsedData: IPlayerData = JSON.parse(dataReceived);
    const { name, password } = parsedData;

    if (!isPlayerExists(name)) {
        const newPlayer: PlayerType = { playerId, name, password, wsObject: ws };
        players.push(newPlayer);

        const response = {
            type: 'reg',
            data: JSON.stringify({
                name,
                id: playerId,
                error: false,
                errorText: '',
            }),
            id: 0,
        };
        ws.send(JSON.stringify(response))
    } else {
        const message = `player with name: ${name} already exist'`
        const response = {
            type: 'reg',
            data: {
                name,
                id: 0,
                error: true,
                errorText: message,
            },
            id: 0,
        };
        ws.send(JSON.stringify(response))
    }
}

export { registerPlayer }