"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDraw = void 0;
const drawCircle_1 = require("./figures/drawCircle");
const drawRectangle_1 = require("./figures/drawRectangle");
const drawSquare_1 = require("./figures/drawSquare");
const handleDraw = (command) => {
    const spaceIndex = command.indexOf(' ');
    const figure = command.substring(5, spaceIndex);
    const size = command.substring(spaceIndex + 1);
    switch (true) {
        case figure === 'circle': {
            (0, drawCircle_1.drawCircle)(+size);
            break;
        }
        case figure === 'square': {
            (0, drawSquare_1.drawSquare)(+size);
            break;
        }
        case figure === 'rectangle': {
            const spaceIndex = size.indexOf(' ');
            const width = +size.substring(0, spaceIndex);
            const length = +size.substring(spaceIndex);
            (0, drawRectangle_1.drawRectangle)(width, length);
            break;
        }
        default:
            break;
    }
};
exports.handleDraw = handleDraw;
