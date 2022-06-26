"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const sendCoords = (ws) => {
    const { x, y } = robotjs_1.default.getMousePos();
    const msg = `mouse_position ${x}px,${y}px`;
    ws.send(msg);
};
exports.default = sendCoords;
