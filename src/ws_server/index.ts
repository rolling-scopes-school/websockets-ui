import WebSocket from "ws";
import { ExtWebSocket, FrontR, FrontRegData, FrontRoomData, FrontShipAdd, Games, Room } from "./types";
import { COMMANDS } from "./types/enum";
import { Game } from "./src/game";


const activePlayers: ExtWebSocket[] = [];

const games: Games = {};

export const start_WSS = () => {

    const WSS_PORT = 3000;
    let idGame: number = 0;

    const wss = new WebSocket.Server({ port: WSS_PORT }, () => console.log('вебсокет'));

    wss.on("connection", (wsClient: ExtWebSocket) => {

        wsClient.index = Math.floor(Math.random() * Date.now());

        wsClient.on('message', async (message) => {

            const frontRes: FrontR = JSON.parse(message.toString());

            switch (frontRes.type) {
                case COMMANDS.reg:
                    const dataFront: FrontRegData = JSON.parse(frontRes.data);
                    wsClient.userName = dataFront.name;
                    wsClient.password = dataFront.password;
                    wsClient.index = Math.floor(Math.random() * Date.now());
                    let serverAnswer = {};

                    if (!activePlayers.find(player => player.userName === dataFront.name)) {
                        activePlayers.push(wsClient);
                        serverAnswer = {
                            type: "reg",
                            data: JSON.stringify(
                                {
                                    name: wsClient.userName,
                                    index: wsClient.index,
                                    error: false,
                                    message: ''
                                }),
                            id: 0
                        }
                    } else
                        serverAnswer = {

                            type: "reg",
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
                    games[idGame] = new Game(wsClient, {} as ExtWebSocket, idGame);
                    updateRoom();
                    break;

                case COMMANDS.addPlayer:
                    const dataRoom: FrontRoomData = JSON.parse(frontRes.data);
                    games[dataRoom.indexRoom].addPLayer(wsClient);
                    break;

                case COMMANDS.addShip:
                    const dataShip: FrontShipAdd = JSON.parse(frontRes.data);
                    games[dataShip.gameId].addShip(dataShip.ships, dataShip.indexPlayer);
                    break;

                case COMMANDS.attack:
                    console.log(frontRes);
                    wsClient.send(
                        JSON.stringify({
                            type: "attack",
                            data: JSON.stringify(
                                {
                                    position:
                                    {
                                        x: 1,
                                        y: 1,
                                    },
                                    currentPlayer: games[1].playerOne.index,
                                    status: "miss",
                                }),
                            id: 0,
                        })
                    )
                    break;

                case COMMANDS.randomAttack:
                    console.log(frontRes);

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
    activePlayers.map((player) => (!player.isGame) ? player.send(JSON.stringify(updateRoom)) : '');
}
