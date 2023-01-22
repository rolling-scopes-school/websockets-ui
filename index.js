import { httpServer } from "./src/http_server/index.js";
import { mouse } from "@nut-tree/nut-js";
import { createWebSocketStream, WebSocketServer } from 'ws';


const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


const wss = new WebSocketServer({ port: 8080 });

wss.on('headers', (_headers, request) => {
    console.log(`Websocket has been started on ${request.rawHeaders[1]}`);
});

wss.on('connection', (ws) => {
    const wsStrem = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });

    wsStrem.on('data', async (chunk) => {
        const [action, distance] = chunk.split(' ')

        const position = await mouse.getPosition()

        switch (action) {
            case 'mouse_up':
                position.y -= distance

                wsStrem.write(`${action}_${distance}`)
                break;

            case 'mouse_down':
                position.y += +distance

                wsStrem.write(`${action}_${distance}`)
                break;

            case 'mouse_left':
                position.x -= distance

                wsStrem.write(`${action}_${distance}`)
                break;

            case 'mouse_right':
                position.x += +distance

                wsStrem.write(`${action}_${distance}`)
                break;

            default:
                break;
        }

        mouse.setPosition(position)
    })
})