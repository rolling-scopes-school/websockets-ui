"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
exports.httpServer = http_1.default.createServer((req, res) => {
    const __dirname = path_1.default.resolve(path_1.default.dirname(""));
    const file_path = __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
    try {
        const stream = fs_1.default.createReadStream(file_path);
        res.writeHead(200);
        stream.pipe(res);
    }
    catch (error) {
        res.writeHead(404);
        res.end(JSON.stringify(error));
    }
});
