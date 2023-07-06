import WebSocket from "ws";
import { FrontR, FrontRegData } from "./types";
import { COMMANDS } from "./types/enum";


interface Room {
    id: number,
    playerOne: ExtWebSocket,
    PlayerTwo: ExtWebSocket,
    isEmpty: boolean,
}

interface ExtWebSocket extends WebSocket {
    index: number,
    userName: string,
    password: string,
    isGame: boolean,
}

const activePlayers: ExtWebSocket[] = [];


const games: Room[] = [];


export const start_WSS = () => {

    const WSS_PORT = 3000;
    let idGame: number = 0;

    const wss = new WebSocket.Server({ port: WSS_PORT }, () => console.log('вебсокет'));

    wss.on("connection", (wsClient: ExtWebSocket) => {

        wsClient.index = Math.floor(Math.random() * Date.now());

        wsClient.on('message', async (message) => {
            wsClient.index = Math.floor(Math.random() * Date.now());
            const frontRes: FrontR = JSON.parse(message.toString());

            switch (frontRes.type) {
                case COMMANDS.reg:
                    const dataFront: FrontRegData = JSON.parse(frontRes.data);
                    wsClient.userName = dataFront.name;
                    wsClient.password = dataFront.password;
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
                    games.push({ id: idGame, playerOne: wsClient, PlayerTwo: {} as ExtWebSocket, isEmpty: false });
                    updateRoom();
                    break;

                case COMMANDS.addPlayer:

                    const frontAdd: FrontR = JSON.parse(message.toString());
console.log(frontAdd.data)
                    wsClient.send(JSON.stringify({
                        type: "create_game",
                        data:
                            JSON.stringify({
                                idGame: 1,
                                idPlayer: wsClient.index,
                            }),
                        id: 0,
                    }))
                    break;

                case COMMANDS.addShip:

                    
                // wsClient.send(JSON.stringify({
                //     type: "create_game",
                //     data:
                //         JSON.stringify({
                //             idGame: idGame,
                //             idPlayer: player.index,
                //         }),
                //     id: 0,
                // }))



                default:
                    break;
            }


            // const examp = {
            //     type: "reg",
            //     data:
            //     {
            //         name: 'fffff',
            //         index: 12345,
            //         error: true,
            //         errorText: 'fsdf',
            //     },
            //     id: 0,
            // }

            // const str = JSON.stringify(examp);



            // console.log(JSON.stringify(examp))

            // wsClient.send(JSON.stringify(examp))
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
                games.map(game => {
                    return {
                        roomId: game.id,
                        roomUsers:
                            [
                                {
                                    name: game.playerOne.userName,
                                    index: game.playerOne.index
                                }
                            ]

                    }
                })
            )
    }
    activePlayers.map((player) => (!player.isGame) ? player.send(JSON.stringify(updateRoom)) : '');
}


// const refreshUser = (name: string): Player => {
//     let resultPlayer: Player = {} as Player;

//     Object.keys(games).map((game: string) => games[Number(game)].map((player: Player) => player.userName === name ? resultPlayer = player : {}))

//     return resultPlayer;
// }