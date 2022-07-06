"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./src/http_server/index.js");
const ws_1 = require("ws");
const dataParser_js_1 = require("./src/dataParser.js");
const HTTP_PORT = 3000;
const WS_PORT = 8080;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
const wsServer = new ws_1.WebSocketServer({ port: WS_PORT });
wsServer.on('connection', (ws) => {
    console.log(`Web socket server on the ${WS_PORT} port!`);
    ws.on('message', (data) => {
        const duplex = (0, ws_1.createWebSocketStream)(ws, { encoding: 'utf-8', decodeStrings: false });
        const dataArr = data.toString().split(' ');
        const action = dataArr[0];
        const height = +dataArr[1];
        const width = +dataArr[2];
        (0, dataParser_js_1.dataParser)(action, height, width, duplex);
    });
});
index_js_1.httpServer.listen(HTTP_PORT);
