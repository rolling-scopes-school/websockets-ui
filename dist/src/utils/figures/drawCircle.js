"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCircle = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const drawCircle = (radius) => {
    try {
        const mousePos = robotjs_1.default.getMousePos();
        console.log(mousePos);
        robotjs_1.default.moveMouse(mousePos.x - radius, mousePos.y);
        setTimeout(() => {
            robotjs_1.default.mouseToggle('down', 'left');
            for (let i = Math.PI * 2; i >= 0; i -= 0.01) {
                const x = mousePos.x - (radius * Math.cos(i));
                const y = mousePos.y + (radius * Math.sin(i));
                robotjs_1.default.dragMouse(x, y);
            }
            robotjs_1.default.mouseToggle('up', 'left');
        }, 100);
    }
    catch (e) {
        console.log('drawCircle error', e);
    }
};
exports.drawCircle = drawCircle;
