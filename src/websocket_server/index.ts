import { WebSocketServer } from 'ws';

const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 8080;

export const webSocketServer = new WebSocketServer({ port: WEBSOCKET_PORT }, () =>
	console.log(`Server started on ${WEBSOCKET_PORT}`),
);
