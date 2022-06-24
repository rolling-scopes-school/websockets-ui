"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSquare = void 0;
const drawLine_1 = require("./drawLine");
const drawSquare = (width) => {
    (0, drawLine_1.drawLine)(width, 'right');
    (0, drawLine_1.drawLine)(width, 'down');
    (0, drawLine_1.drawLine)(width, 'left');
    (0, drawLine_1.drawLine)(width, 'up');
};
exports.drawSquare = drawSquare;
