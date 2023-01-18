import { mouse } from '@nut-tree/nut-js';
import httpServer from './src/http_server';
import { CLIENT_PORT } from './src/env';

console.log(`Start static http server on the ${CLIENT_PORT} port!`);
httpServer.listen(CLIENT_PORT);
