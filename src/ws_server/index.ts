import WebSocket from "ws";
import { FrontR, FrontRegData, FrontRoomData, FrontShipAdd, Ship } from "./types";
import { COMMANDS } from "./types/enum";


interface Room {
    playerOne: ExtWebSocket,
    playerTwo: ExtWebSocket,
    isEmpty: boolean,
}

interface ExtWebSocket extends WebSocket {
    index: number,
    userName: string,
    password: string,
    isGame: boolean,
    ships: Ship[]
}

const activePlayers: ExtWebSocket[] = [];

interface Games {
    [index: number]: Room

}

const games: Room[] = [];


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
                    games[idGame] = {
                        playerOne: wsClient,
                        playerTwo: {} as ExtWebSocket,
                        isEmpty: false
                    };
                    updateRoom();
                    break;

                case COMMANDS.addPlayer:
                    const dataRoom: FrontRoomData = JSON.parse(frontRes.data);
                    if (games[dataRoom.indexRoom].playerOne.index !== wsClient.index) {
                        games[dataRoom.indexRoom].playerTwo = wsClient;
                        console.log(games[dataRoom.indexRoom].playerOne.index, 'playerOne')
                        console.log(games[dataRoom.indexRoom].playerTwo.index, 'playerTwo')
                        openRoom(games[dataRoom.indexRoom].playerOne, dataRoom.indexRoom);
                        openRoom(games[dataRoom.indexRoom].playerTwo, dataRoom.indexRoom);
                    }
                    break;

                case COMMANDS.addShip:

                    const dataShip: FrontShipAdd = JSON.parse(frontRes.data);
                    wsClient.ships = dataShip.ships;
                    console.log(games[dataShip.gameId].playerOne.index, 'playerOne')
                    console.log(games[dataShip.gameId].playerTwo.index, 'playerTwo')
                    checkStartGame(dataShip.gameId);
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

                default:
                    break;
            }



        }
        )
    })
}


// const initGame = (player: Player, gameId: number) => {

//     if (!games[gameId]) {
//         games[gameId] = [player];
//         console.log(games, 'new');
//         return;
//     }

//     if (games[gameId] && games[gameId]?.length < 2) {
//         console.log('12')
//         games[gameId] = [...games[gameId], player];
//         return;
//     }

//     if (games[gameId] && games[gameId]?.length === 2) {
//         games[gameId] = games[gameId].filter(playerNew => playerNew.index !== player.index);
//         games[gameId] = [...games[gameId], player];
//         console.log(games, 'return')
//         return;
//     }

// }

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


function checkStartGame(gameId: number): void {
    if (games[gameId].playerOne.ships && games[gameId].playerTwo.ships) {
        startGame(games[gameId].playerOne);
        startGame(games[gameId].playerTwo);
        turnPlayer(games[gameId].playerOne, games[gameId].playerTwo);
        turnPlayer(games[gameId].playerTwo, games[gameId].playerTwo);
    }
}



function openRoom(player: ExtWebSocket, idRoom: number) {
    player.send(JSON.stringify({
        type: "create_game",
        data:
            JSON.stringify({
                idGame: idRoom,
                idPlayer: player.index,
            }),
        id: 0,
    }))
}

function startGame(player: ExtWebSocket): void {
    player.send(JSON.stringify({
        type: "start_game",
        data: JSON.stringify(
            {
                ships: player.ships,
                currentPlayerIndex: player.index
            }),
        id: 0,
    }))
}


function turnPlayer(player: ExtWebSocket, playerTurn: ExtWebSocket) {
    console.log(player.index)
    player.send(JSON.stringify({
        type: COMMANDS.turn,
        data: JSON.stringify(
            {
                currentPlayer: playerTurn.index,
            }),
        id: 0,
    }
    ))
}


// const refreshUser = (name: string): Player => {
//     let resultPlayer: Player = {} as Player;

//     Object.keys(games).map((game: string) => games[Number(game)].map((player: Player) => player.userName === name ? resultPlayer = player : {}))

//     return resultPlayer;
// }