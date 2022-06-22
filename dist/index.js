"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./src/http_server/index");
// import { WebSocketServer } from 'ws'
const HTTP_PORT = 3000;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
index_1.httpServer.listen(HTTP_PORT);
