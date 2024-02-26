import { WebSocketServer } from "ws"
import {RequestHandler} from "../proxy/requestHandler";

interface IWS_connection {
    requestHandler: RequestHandler
    readonly WS_PORT: number
    readonly socketsHub: any[]
    startConnection: () => void
}

export class WS_connection implements IWS_connection {
    private currentWsClient: any
    readonly WS_PORT: number
    readonly socketsHub = []
    games = {}
    requestHandler: RequestHandler
    constructor(WSS_PORT, requestHandler) {
        this.WS_PORT = WSS_PORT;
        this.requestHandler = requestHandler
    }

    startConnection() {
        const wss = new WebSocketServer({ port: this.WS_PORT }, () => {
            console.log(`Start Web Socket server on the ${this.WS_PORT} port!`)
        });

        wss.on("connection", (wsClient) => {
            this.socketsHub.push(wsClient);
            this.currentWsClient = wsClient

            wsClient.on('message', async (message) => {
                const serverResponse = this.requestHandler.typeRecognition(message)
                this.toClient(serverResponse)
            });

            wsClient.on('close', async (message) => {
                console.log('close', message);
                // Object.keys(games).map((index) => games[Number(index)].closeSocket(wsClient.index))
            });
        });
    }

    toClient(serverResponse) {
        console.log('serverResponse', serverResponse)
        console.log('JSON', JSON.stringify(serverResponse))
        // console.log('this.currentWsClient', this.currentWsClient)
        this.currentWsClient.send(JSON.stringify(serverResponse));
        this.updateRoom()
    }

    updateRoom() {
        const updateRoom = {
            type: "update_room",
            data:
                JSON.stringify(
                    Object.keys(this.games).map((gameId) => {
                        const idNumber = Number(gameId);
                        return {
                            roomId: idNumber,
                            roomUsers:
                                [
                                    {
                                        name: this.games[idNumber].playerOne.userName,
                                        index: this.games[idNumber].playerOne.index
                                    }
                                ]

                        }
                    })
                )
        }

        console.log('updateRoom', JSON.stringify({...updateRoom, id: 0}))

        this.socketsHub.forEach(socket => socket.send(JSON.stringify({...updateRoom, id: 0})));
    }
}
