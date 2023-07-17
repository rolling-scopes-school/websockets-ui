import WebSocket from "ws";
import { ExtWebSocket } from "./types";
import { games, requestProcessing } from "./utils/requestProcessing";

export const sockets: WebSocket[] = [];

export const start_WSS = () => {

    const WSS_PORT = 3000;

    const wss = new WebSocket.Server({ port: WSS_PORT },
        () => console.log('Start Web Socket server on the 3000 port!'));

    wss.on("connection", (wsClient: ExtWebSocket) => {
        sockets.push(wsClient);
        wsClient.index = Math.floor(Math.random() * Date.now());

        wsClient.on('message', async (message) => {
            requestProcessing(message, wsClient);
        }
        )
        wsClient.on('close', async (message) => {
            Object.keys(games).map((index) => games[Number(index)].closeSocket(wsClient.index))
        })
    })
}
