"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = __importDefault(require("jimp"));
const robotjs_1 = __importDefault(require("robotjs"));
const printScreen = async (ws, width = 200, height = 200) => {
    const mousePos = robotjs_1.default.getMousePos();
    const img = robotjs_1.default.screen.capture(mousePos.x, mousePos.y, width, height).image;
    const screenShoot = await new jimp_1.default({ data: img, width, height });
    const imageBase64 = await screenShoot.getBase64Async(jimp_1.default.MIME_PNG);
    return ws.send(`prnt_scrn ${imageBase64.split(',')[1]}\0`);
};
exports.default = printScreen;
