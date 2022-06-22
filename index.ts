import { httpServer } from './src/http_server';
import 'dotenv/config';

const HTTP_PORT: string = process.env.FRONT_PORT;

httpServer.listen(HTTP_PORT);

httpServer.on('listening', () => {
  console.log(`client part is running on port ${HTTP_PORT}`);
});
