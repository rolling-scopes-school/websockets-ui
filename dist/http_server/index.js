"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_http_1 = require("node:http");
exports.httpServer = (0, node_http_1.createServer)((req, res) => {
    const __dirname = (0, node_path_1.resolve)((0, node_path_1.dirname)(""));
    const file_path = __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
    (0, node_fs_1.readFile)(file_path, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});
