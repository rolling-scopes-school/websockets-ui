import { createWebSocketStream, WebSocketServer } from "ws";
import { IWebSocket } from "./types";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { RemoteControl } from "./remote-control";

const WSS_PORT: number = +process.env.WSS_PORT || 8080;
export const wss: WebSocketServer = new WebSocketServer({ port: WSS_PORT });
const remoteControl: RemoteControl = new RemoteControl();

const interval: ReturnType<typeof setInterval> = setInterval(function ping() {
    wss.clients.forEach((ws: any) => {
        if (!ws.isAlive) {
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    })
}, 30000);

const readData = (duplex: Duplex) => {
    return async () => {
        for await (let chunk of duplex) {
            try {
                const [command, ...params] = chunk.split(' ');
                const [x, y] = params.map(Number);

                if (remoteControl[command]) {
                    const result: string = await remoteControl[command](command, x, y);
                    duplex.write(`${result}`);
                } else {
                    console.log(command);
                }
            } catch (error: any) {
                console.error(error);
            }
        }
    }
}

wss.on('connection', async (ws: IWebSocket, req: IncomingMessage) => {
    const duplex: Duplex = createWebSocketStream(ws, {
        encoding: 'utf-8',
        decodeStrings: false,
    }).setMaxListeners(0);

    ws.on('close', () => {
        duplex.destroy();
    });

    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    duplex.on('readable', readData(duplex));
});

wss.on('close', () => {
    clearInterval(interval);
})