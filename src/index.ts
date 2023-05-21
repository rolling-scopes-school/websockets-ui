import {startHttpServer, startWebSocket} from "./servers/index.ts";

export const HTTP_PORT = 5000;
export const WS_PORT = 8080;

const httpServer = startHttpServer(HTTP_PORT, () => {
    console.log(`Started static http server on the ${HTTP_PORT} port.`);
});

const wsServer = startWebSocket(WS_PORT);


const handleSignal = (signal: string, code: number) => {
    console.log('Closing HTTP and WebSocket servers...')
    console.log(`Got ${signal} signal with code ${code}.`)

    wsServer.clients.forEach((client) => {
        client.close();
    });

    wsServer.close();

    httpServer.close();

    process.exit(code);
}

process.on('SIGINT', handleSignal);
process.on('SIGQUIT', handleSignal);
process.on('SIGTERM', handleSignal);
process.on('uncaughtException', handleSignal);
