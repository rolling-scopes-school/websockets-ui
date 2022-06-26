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
exports.startWsServer = void 0;
const stream_1 = require("stream");
const ws_1 = require("ws");
const handleMessage_1 = require("./utils/handleMessage");
const port = 8080;
const startWsServer = () => {
    const onConnect = (wsClient) => {
        console.log(`Client connected`);
        const duplex = (0, ws_1.createWebSocketStream)(wsClient, {
            encoding: 'utf8',
            decodeStrings: false
        });
        const writeStream = new stream_1.Writable({
            write(data, encoding, callback) {
                return __awaiter(this, void 0, void 0, function* () {
                    const parsedMessage = data.toString('utf8').trim();
                    console.log('user send message');
                    console.log(parsedMessage);
                    const result = yield (0, handleMessage_1.handleMessage)(parsedMessage);
                    duplex.write(result);
                    callback();
                });
            }
        });
        duplex.pipe(writeStream);
    };
    const wsServer = new ws_1.WebSocketServer({
        port
    });
    console.log(`Start static websocket server on the ${port} port!`);
    wsServer.on('connection', onConnect);
    process.on('SIGINT', () => {
        console.log('\nserver closes connections before shut down.\n');
        wsServer.close();
        process.exit();
    });
    return wsServer;
};
exports.startWsServer = startWsServer;
