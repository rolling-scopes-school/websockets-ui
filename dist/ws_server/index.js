"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsServer = void 0;
const ws_1 = require("ws");
const commandRouter_1 = require("../commandRouter/commandRouter");
const wsStreamOptions = {
    decodeStrings: false,
    encoding: "utf8",
};
const wsServer = (port = 8080) => {
    const wss = new ws_1.WebSocketServer({ port });
    const commandRouter = new commandRouter_1.CommandRouter();
    wss.on("connection", (webSocket) => __awaiter(void 0, void 0, void 0, function* () {
        const wsStream = (0, ws_1.createWebSocketStream)(webSocket, wsStreamOptions);
        wsStream.on("data", (data = "") => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (data === "") {
                    throw new Error("Empty command received.");
                }
                console.log(`<- ${data}`);
                const [cmd, ...args] = data.split(" ");
                if (commandRouter.isExist(cmd)) {
                    commandRouter.execute(cmd, wsStream, ...args);
                }
                else {
                    throw new Error(`Command ${cmd} doesn't exist.`);
                }
            }
            catch (error) {
                console.log(`:: Got error: ${error.message}`);
            }
        }));
    }));
    return wss;
};
exports.wsServer = wsServer;
