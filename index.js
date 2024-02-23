// import { httpServer } from "./src/http_server/index.ts";
// import {WS_connection} from "./src/websocket_connection/ws_connection.ts";

const { httpServer } = require("./src/http_server/index.ts");
const { WS_connection } = require("./src/websocket_connection/ws_connection.ts");

// import {WS_connection} from "./src/websocket_connection/ws_connection.js";
// import {WS_connection} from "./src/websocket_connection/ws_connection.js";
// const WS_connection = require("./src/websocket_connection/ws_connection.js")
// const { WS_connection } = require("./src/websocket_connection/ws_connection.js");

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const ws_connection = new WS_connection(WS_PORT)
ws_connection.startConnection()
