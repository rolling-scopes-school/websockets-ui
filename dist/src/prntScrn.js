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
exports.prntScrn = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const jimp_1 = __importDefault(require("jimp"));
const prntScrn = (x, y) => __awaiter(void 0, void 0, void 0, function* () {
    const widthSize = 200;
    const heightSize = 200;
    const img = robotjs_1.default.screen.capture(x - widthSize / 2, y - heightSize / 2, widthSize, heightSize);
    const jimp = new jimp_1.default({ data: img.image, width: img.width, height: img.height });
    const base64Img = yield jimp.getBase64Async(jimp_1.default.MIME_PNG);
    const base64 = base64Img.split(',')[1];
    return base64;
});
exports.prntScrn = prntScrn;
