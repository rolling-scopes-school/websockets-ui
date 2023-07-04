import WebSocket from "ws";
import { FrontR, FrontRegData, ServerRegData } from "./types";
import { COMMANDS } from "./types/enum";


interface Room {
    ws1: WebSocket,
    ws2: WebSocket
}


export const start_WSS = () => {



    const WSS_PORT = 3000;

    const wss = new WebSocket.Server({ port: WSS_PORT }, () => console.log('вебсокет'));

    wss.on("connection", (wsClient) =>
        wsClient.on('message', async (message) => {
            const frontRes: FrontR = JSON.parse(message.toString());
            switch (frontRes.type) {
                case COMMANDS.reg:
                    const dataFront: FrontRegData = JSON.parse(frontRes.data);
                    const dataServer: ServerRegData = {} as ServerRegData;
                    dataServer.name = dataFront.name;
                    dataServer.index = 1321561;
                    const exp = { type: "reg", data: JSON.stringify(dataServer), id: 0 }
                    wsClient.send(JSON.stringify(exp))
                    break;

                case COMMANDS.createRoom:
                    wsClient.send(JSON.stringify({
                        type: "create_game",
                        data:
                        JSON.stringify({
                                idGame: 46456,
                                idPlayer: 456,
                            }),
                        id: 0,
                    }))

                   


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
        ))
}