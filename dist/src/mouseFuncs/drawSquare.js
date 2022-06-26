"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const drawSquare = (socket, param1) => {
    const width = Number(param1);
    const height = Number(param1);
    const mousePosBefoWidth = robotjs_1.default.getMousePos();
    for (let i = 0; i <= width; i += 1) {
        const x = mousePosBefoWidth.x;
        const y = mousePosBefoWidth.y + i;
        robotjs_1.default.dragMouse(x, y);
    }
    const mousePosAfterWidth = robotjs_1.default.getMousePos();
    for (let i = 0; i <= height; i += 1) {
        const x = mousePosAfterWidth.x + i;
        const y = mousePosAfterWidth.y;
        robotjs_1.default.dragMouse(x, y);
    }
    const mousePosBefoheigth = robotjs_1.default.getMousePos();
    for (let i = 0; i <= width; i += 1) {
        const x = mousePosBefoheigth.x;
        const y = mousePosBefoheigth.y - i;
        robotjs_1.default.dragMouse(x, y);
    }
    const mousePosAfterHeight = robotjs_1.default.getMousePos();
    for (let i = 0; i <= height; i += 1) {
        const x = mousePosAfterHeight.x - i;
        const y = mousePosAfterHeight.y;
        robotjs_1.default.dragMouse(x, y);
    }
    socket.send('draw_square\0');
};
exports.default = drawSquare;
