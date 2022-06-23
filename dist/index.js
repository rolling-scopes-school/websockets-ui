"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./src/server");
const web_socket_1 = require("./src/web-socket");
const HTTP_PORT = 3000;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
server_1.httpServer.listen(HTTP_PORT);
(0, web_socket_1.startWsServer)();
