"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./src/server");
const web_socket_1 = require("./src/web-socket");
const httpPort = 3000;
console.log(`Start static http server on the ${httpPort} port!`);
server_1.httpServer.listen(httpPort);
(0, web_socket_1.startWsServer)();
