"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawRectangle = void 0;
const drawLine_1 = require("./drawLine");
const robotjs_1 = __importDefault(require("robotjs"));
const drawRectangle = (width, length) => {
    (0, drawLine_1.drawLine)(width, 'right');
    (0, drawLine_1.drawLine)(length, 'down');
    (0, drawLine_1.drawLine)(width, 'left');
    (0, drawLine_1.drawLine)(length, 'up');
    robotjs_1.default.mouseToggle('up', 'left');
};
exports.drawRectangle = drawRectangle;
