"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawLine = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const drawLine = (length, destination) => {
    const mousePos = robotjs_1.default.getMousePos();
    robotjs_1.default.mouseToggle('down', 'left');
    switch (destination) {
        case 'right': {
            for (let i = 0; i < length; i += 1) {
                robotjs_1.default.dragMouse(mousePos.x + i, mousePos.y);
            }
            break;
        }
        case 'down': {
            for (let i = 0; i < length; i += 1) {
                robotjs_1.default.dragMouse(mousePos.x, mousePos.y + i);
            }
            break;
        }
        case 'left': {
            for (let i = 0; i < length; i += 1) {
                robotjs_1.default.dragMouse(mousePos.x - i, mousePos.y);
            }
            break;
        }
        case 'up': {
            for (let i = 0; i < length; i += 1) {
                robotjs_1.default.dragMouse(mousePos.x, mousePos.y - i);
            }
            break;
        }
        default:
            break;
    }
    robotjs_1.default.mouseToggle('up', 'left');
};
exports.drawLine = drawLine;
