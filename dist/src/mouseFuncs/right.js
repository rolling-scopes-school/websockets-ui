"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const right = (socket, param1) => {
    const { x, y } = robotjs_1.default.getMousePos();
    const width = Number(param1);
    robotjs_1.default.dragMouse(x + width, y);
    return socket.send('mouse_right ${height}px\0');
};
exports.default = right;
