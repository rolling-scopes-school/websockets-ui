import { mouse } from "@nut-tree/nut-js";
import { createWebSocketStream, WebSocketServer } from "ws";
import { WsActions, WSS_PORT } from "./web-socket.constants";

export const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('headers', (_headers, request) => {
    console.log(`Websocket has been started on ${request.rawHeaders[1]}`);
});

wss.on('connection', (ws) => {
    const wsStrem = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });

    wsStrem.on('data', async (chunk) => {
        const [action, distance]: [WsActions, string] = chunk.split(' ')

        const position = await mouse.getPosition()

        switch (action) {
            case WsActions.mouseUp:
                position.y -= +distance

                wsStrem.write(`${action}_${distance}`)
                break;

            case WsActions.mouseDown:
                position.y += +distance

                wsStrem.write(`${action}_${distance}`)
                break;

            case WsActions.mouseLeft:
                position.x -= +distance

                wsStrem.write(`${action}_${distance}`)
                break;

            case WsActions.mouseRight:
                position.x += +distance

                wsStrem.write(`${action}_${distance}`)
                break;

            default:
                break;
        }

        mouse.setPosition(position)
    })
})