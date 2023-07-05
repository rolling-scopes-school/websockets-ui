import WebSocket from "ws";
import { FrontR, FrontRegData, ServerRegData } from "./types";
import { COMMANDS } from "./types/enum";


interface Room {
    ws1: WebSocket,
    ws2: WebSocket
}

interface Player {
    index: number,
    // userName: string,
    wsClient: WebSocket
}

type idGame = number;

interface Games {
    [key: number]: Player[]
}

const games: Games = {};


export const start_WSS = () => {

    const WSS_PORT = 3000;
    let idGame: number = 0;

    const wss = new WebSocket.Server({ port: WSS_PORT }, () => console.log('вебсокет'));

    wss.on("connection", (wsClient: WebSocket) => {

        wsClient.on('message', async (message) => {
            const player: Player = {
                index: Math.floor(Math.random() * Date.now()),
                wsClient: wsClient,

            }
            const frontRes: FrontR = JSON.parse(message.toString());
            console.log(frontRes)

            switch (frontRes.type) {
                case COMMANDS.reg:
                    const dataFront: FrontRegData = JSON.parse(frontRes.data);

                    const serverAnswer = {

                        type: "reg",
                        data: JSON.stringify(
                            {
                                name: dataFront.name,
                                index: player.index,
                                error: false,
                                message: ''
                            }),
                        id: 0
                    }

                    const updateRoom = JSON.stringify({
                        type: "update_room",
                        data: 
                            [
                                JSON.stringify({
                                    roomId: 1,
                                    roomUsers:
                                        [
                                            JSON.stringify({
                                                name: 'Alex',
                                                index: 321323141234
                                            })
                                        ],
                                })
                            ]
                            
                    })
                    console.log(updateRoom)
                    wsClient.send(JSON.stringify(serverAnswer));
                    wsClient.send(JSON.stringify(updateRoom));
                    break;

                case COMMANDS.createRoom:
                    idGame += 1;
                    initGame(player, idGame);
                    wsClient.send(JSON.stringify({
                        type: "create_game",
                        data:
                            JSON.stringify({
                                idGame: idGame,
                                idPlayer: player.index,
                            }),
                        id: 0,
                    }))
                case COMMANDS.addShip:

                    console.log(frontRes.data)
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


const initGame = (player: Player, gameId: number) => {

    if (!games[gameId]) {
        games[gameId] = [player];
        console.log(games, 'new');
        return;
    }

    if (games[gameId] && games[gameId]?.length < 2) {
        console.log('12')
        games[gameId] = [...games[gameId], player];
        return;
    }

    if (games[gameId] && games[gameId]?.length === 2) {
        games[gameId] = games[gameId].filter(playerNew => playerNew.index !== player.index);
        games[gameId] = [...games[gameId], player];
        console.log(games, 'return')
        return;
    }

}