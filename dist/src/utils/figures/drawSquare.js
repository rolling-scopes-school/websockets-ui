"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSquare = void 0;
const drawLine_1 = require("./drawLine");
const robotjs_1 = __importDefault(require("robotjs"));
const drawSquare = (width) => {
    (0, drawLine_1.drawLine)(width, 'right');
    (0, drawLine_1.drawLine)(width, 'down');
    (0, drawLine_1.drawLine)(width, 'left');
    (0, drawLine_1.drawLine)(width, 'up');
    robotjs_1.default.mouseToggle('up', 'left');
};
exports.drawSquare = drawSquare;
