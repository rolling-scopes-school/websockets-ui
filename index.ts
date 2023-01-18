import httpServer from './src/httpServer';
import { CLIENT_PORT, WEBSOCKET_SERVER_PORT } from './src/env';
import wsServer from './src/wsServer';

console.log(`Start websocket server on port ${WEBSOCKET_SERVER_PORT}`);
wsServer(WEBSOCKET_SERVER_PORT);

console.log(`Start static http server on the ${CLIENT_PORT}`);
httpServer.listen(CLIENT_PORT);
