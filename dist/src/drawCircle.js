"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCircle = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const drawCircle = (duplex, x, y, width) => {
    robotjs_1.default.mouseToggle('down');
    for (let i = 0; i <= Math.PI * 2; i += 0.05) {
        const newX = x + width * Math.cos(i) - width;
        const newY = y + width * Math.sin(i);
        robotjs_1.default.dragMouse(newX, newY);
    }
    robotjs_1.default.mouseToggle('up');
    duplex.write(`draw_circle \0`, 'utf-8');
};
exports.drawCircle = drawCircle;
