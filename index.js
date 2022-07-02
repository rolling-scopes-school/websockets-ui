"use strict";
exports.__esModule = true;
var index_js_1 = require("./src/http_server/index.js");
var HTTP_PORT = 3000;
var WS_PORT = 8080;
console.log("Start static http server on the ".concat(HTTP_PORT, " port!"));
index_js_1.httpServer.listen(HTTP_PORT);
