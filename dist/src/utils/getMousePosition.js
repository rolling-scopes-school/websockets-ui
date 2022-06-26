"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMousePosition = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const getMousePosition = () => {
    try {
        const { x, y } = robotjs_1.default.getMousePos();
        throw new Error();
        return [x, y];
    }
    catch (e) {
        console.log('getMousePosition error', e);
        return [0, 0];
    }
};
exports.getMousePosition = getMousePosition;
