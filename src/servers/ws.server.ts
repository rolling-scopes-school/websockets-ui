import WebSocket, {WebSocketServer} from "ws";

export const startWebSocket = (port: number): WebSocket.Server => {
    const wsServer = new WebSocketServer({ port });

    console.log(`Started WebSocket server on the ${port} port.`)

    wsServer.on('connection', (ws) => {
        console.log('New WebSocket client has been connected to WebSocket Server.');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
            console.log('WebSocket client has been disconnected from WebSocket Server.');
        });
    });

    return wsServer;
}
