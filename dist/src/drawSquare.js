"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSquare = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const drawSquare = (duplex, x, y, width) => {
    robotjs_1.default.mouseToggle('down');
    robotjs_1.default.moveMouseSmooth(x + width, y);
    robotjs_1.default.moveMouseSmooth(x + width, y + width);
    robotjs_1.default.moveMouseSmooth(x, y + width);
    robotjs_1.default.moveMouseSmooth(x, y);
    robotjs_1.default.mouseToggle('up');
    duplex.write(`draw_square \0`, 'utf-8');
};
exports.drawSquare = drawSquare;
