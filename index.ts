import { httpServer } from './src/http_server/index';
import mouse from '@nut-tree/nut-js';
import 'dotenv/config';

const port = Number(process.env.HTTP_PORT) || 3000;

console.log(`Start static http server on the ${port} port!`);
httpServer.listen(port);
