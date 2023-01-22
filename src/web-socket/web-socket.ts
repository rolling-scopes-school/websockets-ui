import { mouse } from "@nut-tree/nut-js";
import { createWebSocketStream, WebSocketServer } from "ws";
import { WsActions, WSS_PORT } from "./web-socket.constants";
import { getChangedPosition } from "./web-socket.utils";

export const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('headers', (_headers, request) => {
    console.log(`Websocket has been started on ${request.rawHeaders[1]}`);
});

wss.on('connection', (ws) => {
    const wsStream = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });

    wsStream.on('data', async (chunk) => {
        const [action, distance]: [WsActions, string] = chunk.split(' ')

        const changedPosition = await getChangedPosition(action, distance)

        wsStream.write(`${action}_${distance}`)
        mouse.setPosition(changedPosition)
    })
})