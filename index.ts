import {httpServer} from './src/http_server/index';
import "dotenv/config";

const HTTP_PORT = process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
