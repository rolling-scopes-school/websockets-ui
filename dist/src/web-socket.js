"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWsServer = void 0;
const ws_1 = __importDefault(require("ws"));
const server_1 = require("./server");
const robotjs_1 = __importDefault(require("robotjs"));
const getNewMousePosition_1 = require("./utils/getNewMousePosition");
const startWsServer = () => {
    function onConnect(wsClient) {
        console.log(`Client connected`);
        wsClient.on('message', (message) => {
            console.log('user send message');
            const parsedMessage = message.toString();
            console.log(parsedMessage);
            switch (true) {
                case parsedMessage === 'mouse_position': {
                    const { x, y } = robotjs_1.default.getMousePos();
                    wsClient.send(`mouse_position ${[x, y]}`);
                    break;
                }
                case parsedMessage.startsWith('mouse_'): {
                    const { x, y } = robotjs_1.default.getMousePos();
                    const [newX, newY] = (0, getNewMousePosition_1.getNewMousePosition)(parsedMessage, x, y);
                    wsClient.send('mouse_move');
                    robotjs_1.default.moveMouse(newX, newY);
                    break;
                }
                case parsedMessage.startsWith('draw_'): {
                    wsClient.send('draw_circle');
                    let { x, y } = robotjs_1.default.getMousePos();
                    const xMin = x;
                    const yMin = y - 100;
                    const xMax = x + 100;
                    const yMax = y + 100;
                    const drawCircle = (radius) => {
                        const mousePos = robotjs_1.default.getMousePos();
                        robotjs_1.default.mouseToggle('down', 'left');
                        for (let i = Math.PI * 2; i >= 0; i -= 0.01) {
                            const x = mousePos.x - (radius * Math.cos(i));
                            const y = mousePos.y + (radius * Math.sin(i));
                            robotjs_1.default.dragMouse(x, y);
                        }
                        robotjs_1.default.mouseToggle('up', 'left');
                        robotjs_1.default.moveMouse(x, y);
                    };
                    drawCircle(100);
                    break;
                }
                default:
                    wsClient.send('unknow_command');
                    console.log('unknow command');
                    break;
            }
        });
        wsClient.on('close', () => {
            console.log('user disconnected');
        });
    }
    const wsServer = new ws_1.default.WebSocketServer({
        server: server_1.httpServer,
    });
    wsServer.on('connection', onConnect);
    return wsServer;
};
exports.startWsServer = startWsServer;
