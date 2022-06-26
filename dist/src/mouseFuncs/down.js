"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const down = (socket, param1) => {
    const { x, y } = robotjs_1.default.getMousePos();
    const height = Number(param1);
    robotjs_1.default.dragMouse(x, y + height);
    return socket.send('mouse_down ${height}px\0');
};
exports.default = down;
