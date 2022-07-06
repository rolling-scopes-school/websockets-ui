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
exports.dataParser = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const prntScrn_1 = require("./prntScrn");
const drawRectangle_1 = require("./drawRectangle");
const drawSquare_1 = require("./drawSquare");
const drawCircle_1 = require("./drawCircle");
const dataParser = (action, height, width, duplex) => __awaiter(void 0, void 0, void 0, function* () {
    const { x, y } = robotjs_1.default.getMousePos();
    switch (action) {
        case 'mouse_position':
            duplex.write(`mouse_position ${x},${y} \0`, 'utf-8');
            console.log(`"mouse_position" completed!\n`);
            break;
        case 'mouse_left':
            duplex.write(`mouse_left \0`, 'utf-8');
            robotjs_1.default.moveMouse(-width + x, y);
            console.log(`"mouse_left" completed!\n`);
            break;
        case 'mouse_right':
            duplex.write(`mouse_right \0`, 'utf-8');
            robotjs_1.default.moveMouse(width + x, y);
            console.log(`"mouse_right" completed successfully!\n`);
            break;
        case 'mouse_down':
            duplex.write(`mouse_down \0`, 'utf-8');
            robotjs_1.default.moveMouse(x, width + y);
            console.log(`"mouse_down" completed!\n`);
            break;
        case 'mouse_up':
            duplex.write(`mouse_up \0`, 'utf-8');
            robotjs_1.default.moveMouse(x, -width + y);
            console.log(`"mouse_up" completed!\n`);
            break;
        case 'prnt_scrn':
            const base64 = yield (0, prntScrn_1.prntScrn)(x, y);
            duplex.write(`prnt_scrn ${base64} \0`, 'utf-8');
            console.log(`"prnt_scrn" completed!\n`);
            break;
        case 'draw_circle':
            (0, drawCircle_1.drawCircle)(duplex, x, y, width);
            console.log(`"draw_circle" completed!\n`);
            break;
        case 'draw_square':
            (0, drawSquare_1.drawSquare)(duplex, x, y, width);
            console.log(`"draw_square" completed!\n`);
            break;
        case 'draw_rectangle':
            (0, drawRectangle_1.drawRectangle)(duplex, x, y, width, height);
            console.log(`draw_rectangle" completed !\n`);
            break;
        default:
            console.log(`Action failed!\n`);
            break;
    }
});
exports.dataParser = dataParser;
