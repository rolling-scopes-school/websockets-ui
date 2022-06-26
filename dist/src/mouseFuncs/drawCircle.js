"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const drawCircle = (socket, param1) => {
    const mousePos = robotjs_1.default.getMousePos();
    const radius = Number(param1);
    const drawingStep = 0.05;
    for (let i = 0; i <= Math.PI * 2; i += drawingStep) {
        const x = mousePos.x - radius + radius * Math.cos(i);
        const y = mousePos.y + radius * Math.sin(i);
        robotjs_1.default.dragMouse(x, y);
    }
    return socket.send('draw_circle\0');
};
exports.default = drawCircle;
