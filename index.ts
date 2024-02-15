import { WebSocket } from 'ws';
import { httpServer } from './src/http_server';
import { createWSS } from './src/ws'

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = createWSS();

process.on('SIGINT', () => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.close();
        }
    });

    process.exit(0);
});