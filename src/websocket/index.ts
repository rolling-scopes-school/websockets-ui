import { WebSocket as webSocket } from 'ws';
import * as http from 'http';


function webSocketServer(wsPort: number | string) {


    const server = http.createServer();

    const wss = new webSocket.Server({ noServer: true });

    server.listen(wsPort, () => {
        console.log(`WS_Server started on port ${wsPort}`);
    });

    wss.on('connection', (ws: webSocket) => {
        console.log('A client connected');

        ws.on('message', (message: string) => {
            console.log('Received message:', message);
        });

        ws.on('close', () => {
            console.log('A client disconnected');
        });
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
}


export { webSocketServer }