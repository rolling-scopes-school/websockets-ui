import WebSocket, {createWebSocketStream, WebSocketServer} from "ws";
import {getCommandHandler} from "../commands/index.js";

const handleConnection = (ws: WebSocket) => {
    console.log('New WebSocket client has been connected to WebSocket Server.');

    const wsStream = createWebSocketStream(ws, {
        decodeStrings: false,
        encoding: 'utf8',
    });

    wsStream.on('data', handleMessage);

    ws.on('close', handleClose);
};

const handleMessage = async (message: string): Promise<void> => {
    console.log(`Received message: ${message}`);

    try {
        const [commandName, ...args] = message.split(' ');

        if (!commandName) {
            console.log('Command name is incorrect');
            return;
        }

        console.log(commandName, args);

        const commandHandler = getCommandHandler(commandName);

        const result = await commandHandler(...args);

        console.log(`Command result: ${result}`);
    } catch (error: unknown) {
        console.error(error);
    }
}

const handleClose = (): void => {
    console.log('WebSocket client has been disconnected from WebSocket Server.');
}

export const startWebSocket = (port: number): WebSocket.Server => {
    const wsServer = new WebSocketServer({ port });

    console.log(`Started WebSocket server on the ${port} port.`)

    wsServer.on('connection', handleConnection);

    wsServer.on('error', console.error);

    return wsServer;
}
