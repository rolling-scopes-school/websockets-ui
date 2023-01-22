import httpServer from './src/httpServer';
import { CLIENT_PORT, WEBSOCKET_SERVER_PORT } from './src/env';
import wsServer from './src/wsServer';
import log from './src/shared/logger';

console.log(`Start websocket server on port ${WEBSOCKET_SERVER_PORT}`);
const wss = wsServer(WEBSOCKET_SERVER_PORT);

console.log(`Start static http server on port ${CLIENT_PORT}`);
httpServer.listen(CLIENT_PORT);

process.on('SIGINT', () => {
  log('The connection will be closed!');

  wss.close();
  log('The websocket server has been closed!');

  httpServer.close();
  log('The http server has been closed!');

  process.exit(0);
});
