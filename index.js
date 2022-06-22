import { httpServer } from './src/http_server/index.js';
import "dotenv/config";

const PORT = Number(process.env.FRONT_PORT) || 3000;

console.log(`Start static http server on the ${PORT} port!`);
httpServer.listen(PORT);
