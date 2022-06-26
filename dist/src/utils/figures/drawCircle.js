"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCircle = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const drawCircle = (radius) => {
    const mousePos = robotjs_1.default.getMousePos();
    robotjs_1.default.moveMouse(mousePos.x - radius, mousePos.y);
    robotjs_1.default.mouseToggle('down', 'left');
    for (let i = Math.PI * 2; i >= 0; i -= 0.01) {
        const x = mousePos.x - (radius * Math.cos(i));
        const y = mousePos.y + (radius * Math.sin(i));
        robotjs_1.default.dragMouse(x, y);
    }
    robotjs_1.default.mouseToggle('up', 'left');
    robotjs_1.default.moveMouse(mousePos.x, mousePos.y);
};
exports.drawCircle = drawCircle;
