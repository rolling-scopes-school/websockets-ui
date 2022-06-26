import Jimp from 'jimp';
import robot from 'robotjs';
import { createWebSocketStream, WebSocket } from 'ws';

import { httpServer } from './src/http_server';
import { webSocketServer } from './src/websocket_server';
import './env';

console.log(`Start static http server on the ${process.env.HTTP_PORT} port!`);

httpServer.listen(process.env.HTTP_PORT);

webSocketServer.on('connection', function connection(ws: WebSocket) {
	const duplex = createWebSocketStream(ws, { decodeStrings: false, encoding: 'utf8' });
	duplex.on('data', async (message: string) => {
		console.log('received: %s', message);
	});
});
