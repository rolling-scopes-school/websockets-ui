"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const http_1 = require("http");
exports.httpServer = (0, http_1.createServer)((req, res) => {
    const __dirname = (0, path_1.resolve)((0, path_1.dirname)(""));
    const file_path = __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
    (0, fs_1.readFile)(file_path, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});
