"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_server_1 = require("./http_server");
const HTTP_PORT = 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
http_server_1.httpServer.listen(HTTP_PORT);
