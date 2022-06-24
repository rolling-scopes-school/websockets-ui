"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawRectangle = void 0;
const drawLine_1 = require("./drawLine");
const drawRectangle = (width, length) => {
    (0, drawLine_1.drawLine)(width, 'right');
    (0, drawLine_1.drawLine)(length, 'down');
    (0, drawLine_1.drawLine)(width, 'left');
    (0, drawLine_1.drawLine)(length, 'up');
};
exports.drawRectangle = drawRectangle;
