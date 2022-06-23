import { httpServer } from './src/http_server/index';

const HTTP_PORT = 3000;

console.log(`Static http server started on http://localhost:${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
