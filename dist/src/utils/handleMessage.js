"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const getNewMousePosition_1 = require("./getNewMousePosition");
const handleDraw_1 = require("./handleDraw");
const captureScreen_1 = require("./captureScreen");
const getMousePosition_1 = require("./getMousePosition");
const handleMessage = (parsedMessage) => __awaiter(void 0, void 0, void 0, function* () {
    switch (true) {
        case parsedMessage === 'mouse_position': {
            return `mouse_position ${(0, getMousePosition_1.getMousePosition)()}`;
        }
        case parsedMessage.startsWith('mouse_'): {
            const { x, y } = robotjs_1.default.getMousePos();
            const [newX, newY] = (0, getNewMousePosition_1.getNewMousePosition)(parsedMessage, x, y);
            robotjs_1.default.moveMouse(newX, newY);
            return 'mouse_move';
        }
        case parsedMessage.startsWith('draw_'): {
            (0, handleDraw_1.handleDraw)(parsedMessage);
            return parsedMessage;
        }
        case parsedMessage === 'prnt_scrn': {
            console.log(parsedMessage);
            const result = yield (0, captureScreen_1.captureScreen)();
            return result;
        }
        default:
            return 'unknow command';
    }
});
exports.handleMessage = handleMessage;
