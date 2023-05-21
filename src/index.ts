import {startHttpServer, startWebSocket} from "./servers/index.ts";

export const HTTP_PORT = 5000;
export const WS_PORT = 5050;

const httpServer = startHttpServer(HTTP_PORT, () => {
    console.log(`Started static http server on the ${HTTP_PORT} port.`);
});

const wss = startWebSocket(WS_PORT);

