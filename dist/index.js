"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const ws_1 = require("ws");
const os_1 = require("os");
require("dotenv/config");
const index_1 = require("./src/http_server/index");
const utils_1 = require("./src/utils");
const mouseFuncs_1 = require("./src/mouseFuncs");
const printScreen_1 = __importDefault(require("./src/screen/printScreen"));
const { pid, env } = process;
const { PORT, WSPORT } = env;
index_1.httpServer.listen(PORT);
(0, utils_1.write)(`${os_1.EOL}Start static http server on the ${PORT} port!
Server pid: ${pid}
Websocket able to be run at: ${WSPORT} port`);
const wss = new ws_1.WebSocketServer({ port: WSPORT });
wss.on('connection', (ws) => {
    ws.send('open');
    (0, mouseFuncs_1.sendCoords)(ws);
    ws.on('message', async (data) => {
        const input = String(data);
        const [command, param1, param2] = input.split(' ');
        switch (command) {
            case 'mouse_position':
                const { x, y } = robotjs_1.default.getMousePos();
                const msg = 'mouse_position' + '_x_' + x + '_y_' + y;
                return (0, utils_1.makeOperations)(msg, (0, mouseFuncs_1.sendCoords)(ws));
            case 'mouse_up':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.up)(ws, param1));
            case 'mouse_down':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.down)(ws, param1));
            case 'mouse_right':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.right)(ws, param1));
            case 'mouse_left':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.left)(ws, param1));
            case 'draw_circle':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.drawCircle)(ws, param1));
            case 'draw_square':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.drawSquare)(ws, param1));
            case 'draw_rectangle':
                return (0, utils_1.makeOperations)(input, (0, mouseFuncs_1.drawReactagle)(ws, param1, param2));
            case 'prnt_scrn':
                return (0, utils_1.makeOperations)('prnt_scrn base64 string (png buf)', (0, printScreen_1.default)(ws));
            default:
                (0, utils_1.write)(`Unknown input: ${input}`);
        }
    });
    ws.on('close', () => {
        ws.send('closed\0');
        (0, utils_1.write)('Websocket closed');
        ws.close();
    });
});
process.on('SIGINT', () => {
    (0, utils_1.write)(`Server (port ${PORT}) and and websocket (port ${WSPORT}) are closed\n`);
    wss.close();
    index_1.httpServer.close();
});
process.on('exit', () => {
    (0, utils_1.write)(`Server (port ${PORT}) and and websocket (port ${WSPORT}) are closed\n`);
    wss.close();
    index_1.httpServer.close();
});
