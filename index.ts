import { httpServer } from "./src/http_server/server";
import { readyBackend } from "./src/backend/index";

const HTTP_PORT = 3000;

console.log(`Server starts on port ${HTTP_PORT}!`);
httpServer.listen(HTTP_PORT);

readyBackend();
