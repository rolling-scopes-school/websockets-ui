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
exports.captureScreen = void 0;
const jimp_1 = __importDefault(require("jimp"));
const robotjs_1 = __importDefault(require("robotjs"));
const getValidatedMousePos = (currentMousePos, direction, size) => {
    let result = 0;
    let maxPosition = 0;
    if (direction === 'x') {
        maxPosition = robotjs_1.default.getScreenSize().width;
    }
    if (direction === 'y') {
        maxPosition = robotjs_1.default.getScreenSize().height;
    }
    if (currentMousePos + size > maxPosition) {
        result = maxPosition - size;
    }
    else if (currentMousePos - size / 2 >= 0) {
        result = currentMousePos - size / 2;
    }
    return result;
};
const captureScreen = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { x, y } = robotjs_1.default.getMousePos();
        const { width: maxX, height: maxY } = robotjs_1.default.getScreenSize();
        const size = 200;
        let newX = getValidatedMousePos(x, 'x', size);
        let newY = getValidatedMousePos(y, 'y', size);
        const bitmap = robotjs_1.default.screen.capture(newX, newY, size, size);
        const img = new jimp_1.default(size * 2, size * 2);
        img.bitmap.data = bitmap === null || bitmap === void 0 ? void 0 : bitmap.image;
        const buffer = yield img.getBufferAsync(jimp_1.default.MIME_PNG);
        const base64String = buffer.toString('base64');
        const result = 'prnt_scrn ' + base64String;
        return result;
    }
    catch (e) {
        console.log('captureScreen error', e);
    }
});
exports.captureScreen = captureScreen;
