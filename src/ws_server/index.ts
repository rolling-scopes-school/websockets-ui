import WebSocket from "ws";
import { AttackData, ExtWebSocket, FrontR, FrontRegData, FrontRoomData, FrontShipAdd, Games, Player, RandomAttackData } from "./types";
import { COMMANDS } from "./types/enum";
import { Game } from "./src/game";


const activePlayers: string[] = [];
const sockets: WebSocket[] = [];
const games: Games = {};

export const start_WSS = () => {

    const WSS_PORT = 3000;
    let idGame: number = 0;

    const wss = new WebSocket.Server({ port: WSS_PORT }, () => console.log('вебсокет'));

    wss.on("connection", (wsClient: ExtWebSocket) => {
        sockets.push(wsClient);
        wsClient.index = Math.floor(Math.random() * Date.now());

        wsClient.on('message', async (message) => {

            const frontRes: FrontR = JSON.parse(message.toString());
            const player: Player = {
                index: Math.floor(Math.random() * Date.now()),
                userName: '',
                password: '',
                ships: [],
                attackCell: [],
                socket: wsClient
            }

            switch (frontRes.type) {
                case COMMANDS.reg:

                    const dataFront: FrontRegData = JSON.parse(frontRes.data);
                    player.userName = dataFront.name;
                    player.userName = dataFront.password;
                    let serverAnswer = {};

                    if (!activePlayers.find(player => player === dataFront.name)) {
                        activePlayers.push(dataFront.name);
                        serverAnswer = {
                            type: COMMANDS.reg,
                            data: JSON.stringify(
                                {
                                    name: player.userName,
                                    index: player.index,
                                    error: false,
                                    message: ''
                                }),
                            id: 0
                        }
                    } else
                        serverAnswer = {
                            type: COMMANDS.reg,
                            data: JSON.stringify(
                                {
                                    name: '',
                                    index: '',
                                    error: true,
                                    message: 'The user exists'
                                }),
                            id: 0
                        }

                    wsClient.send(JSON.stringify(serverAnswer));
                    updateRoom();
                    break;

                case COMMANDS.createRoom:
                    idGame += 1;
                    games[idGame] = new Game(player, {} as Player, idGame, false);
                    updateRoom();
                    break;

                case COMMANDS.addPlayer:
                    const dataRoom: FrontRoomData = JSON.parse(frontRes.data);
                    games[dataRoom.indexRoom].addPLayer(player);
                    break;

                case COMMANDS.addShip:
                    const dataShip: FrontShipAdd = JSON.parse(frontRes.data);
                    games[dataShip.gameId].addShip(dataShip.ships, dataShip.indexPlayer);
                    break;

                case COMMANDS.attack:
                    const dataAttack: AttackData = JSON.parse(frontRes.data);
                    games[dataAttack.gameId].attack(dataAttack);
                    break;

                case COMMANDS.randomAttack:
                    const dataRandom: RandomAttackData = JSON.parse(frontRes.data);
                    games[dataRandom.gameId].randomAttack(dataRandom.indexPlayer);
                    break;
                case COMMANDS.single:
                    idGame += 1;
                    games[idGame] = new Game(player, {} as Player, idGame, true);


                default:
                    break;
            }
        }
        )
    })
}

const updateRoom = () => {
    const updateRoom = {
        type: "update_room",
        data:
            JSON.stringify(
                Object.keys(games).map((gameId) => {
                    const idNumber = Number(gameId);
                    return {
                        roomId: idNumber,
                        roomUsers:
                            [
                                {
                                    name: games[idNumber].playerOne.userName,
                                    index: games[idNumber].playerOne.index
                                }
                            ]

                    }
                })
            )
    }
    sockets.map(socket => socket.send(JSON.stringify(updateRoom)));
}
