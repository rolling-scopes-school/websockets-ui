"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawRectangle = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const drawRectangle = (duplex, x, y, width, height) => {
    robotjs_1.default.mouseToggle('down');
    robotjs_1.default.moveMouseSmooth(x + width, y);
    robotjs_1.default.moveMouseSmooth(x + width, y + height);
    robotjs_1.default.moveMouseSmooth(x, y + height);
    robotjs_1.default.moveMouseSmooth(x, y);
    robotjs_1.default.mouseToggle('up');
    duplex.write(`draw_rectangle \0`, 'utf-8');
};
exports.drawRectangle = drawRectangle;
