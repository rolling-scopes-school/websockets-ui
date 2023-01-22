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
exports.NutAdaptor = void 0;
const nut_js_1 = require("@nut-tree/nut-js");
const jimp_1 = __importDefault(require("jimp"));
class NutAdaptor {
    mousePosition() {
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            if (webSocket) {
                const coords = yield nut_js_1.mouse.getPosition();
                const answer = `mouse_position ${coords.x},${coords.y}`;
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    mouseUp() {
        var _a;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const step = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            if (webSocket) {
                yield nut_js_1.mouse.move((0, nut_js_1.up)(step));
                const answer = "mouse_up";
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    mouseDown() {
        var _a;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const step = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            if (webSocket) {
                yield nut_js_1.mouse.move((0, nut_js_1.down)(step));
                const answer = "mouse_down";
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    mouseLeft() {
        var _a;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const step = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            if (webSocket) {
                yield nut_js_1.mouse.move((0, nut_js_1.left)(step));
                const answer = "mouse_left";
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    mouseRight() {
        var _a;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const step = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            if (webSocket) {
                yield nut_js_1.mouse.move((0, nut_js_1.right)(step));
                const answer = "mouse_right";
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    drawRectangle() {
        var _a, _b;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const width = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            const height = (_b = +arguments[2]) !== null && _b !== void 0 ? _b : 0;
            if (webSocket) {
                nut_js_1.mouse.config.mouseSpeed = 100;
                yield nut_js_1.mouse.pressButton(0);
                yield nut_js_1.mouse.drag((0, nut_js_1.right)(width));
                yield nut_js_1.mouse.drag((0, nut_js_1.down)(height));
                yield nut_js_1.mouse.drag((0, nut_js_1.left)(width));
                yield nut_js_1.mouse.drag((0, nut_js_1.up)(height));
                yield nut_js_1.mouse.releaseButton(0);
                const answer = `draw_rectangle ${width},${height}`;
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    drawSquare() {
        var _a;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const width = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            if (webSocket) {
                nut_js_1.mouse.config.mouseSpeed = 100;
                yield nut_js_1.mouse.pressButton(0);
                yield nut_js_1.mouse.drag((0, nut_js_1.right)(width));
                yield nut_js_1.mouse.drag((0, nut_js_1.down)(width));
                yield nut_js_1.mouse.drag((0, nut_js_1.left)(width));
                yield nut_js_1.mouse.drag((0, nut_js_1.up)(width));
                yield nut_js_1.mouse.releaseButton(0);
                const answer = `draw_square ${width}`;
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    drawCircle() {
        var _a;
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const radius = (_a = +arguments[1]) !== null && _a !== void 0 ? _a : 0;
            if (webSocket) {
                const coords = yield nut_js_1.mouse.getPosition();
                yield nut_js_1.mouse.pressButton(0);
                for (let i = 0; i <= Math.PI * 2; i += 0.06) {
                    const x = coords.x - radius * Math.cos(i) + radius;
                    const y = coords.y - radius * Math.sin(i);
                    yield nut_js_1.mouse.drag((0, nut_js_1.straightTo)(new nut_js_1.Point(x, y)));
                }
                yield nut_js_1.mouse.releaseButton(0);
                const answer = `draw_circle ${radius}`;
                console.log(`-> ${answer}`);
                webSocket.write(answer);
            }
        });
    }
    printScreen() {
        return __awaiter(this, arguments, void 0, function* () {
            const webSocket = arguments[0];
            const screenShotWidth = 200;
            const screenShotHeight = 200;
            if (webSocket) {
                const screenWidth = yield nut_js_1.screen.width();
                const screenHeight = yield nut_js_1.screen.height();
                const coords = yield nut_js_1.mouse.getPosition();
                coords.x = Math.max(coords.x - screenShotWidth / 2, screenShotWidth / 2);
                coords.x = Math.min(coords.x, screenWidth - screenShotWidth / 2);
                coords.y = Math.max(coords.y - screenShotHeight / 2, screenShotHeight / 2);
                coords.y = Math.min(coords.y, screenHeight - screenShotHeight / 2);
                const region = new nut_js_1.Region(coords.x - screenShotWidth / 2, coords.y - screenShotHeight / 2, screenShotWidth, screenShotHeight);
                try {
                    const { data, width, height } = yield (yield nut_js_1.screen.grabRegion(region)).toRGB();
                    const image = new jimp_1.default({ data, width, height });
                    const imageBase64 = (yield image.getBufferAsync(jimp_1.default.MIME_PNG)).toString("base64");
                    const answer = `prnt_scrn ${imageBase64}`;
                    console.log(`-> ${answer}`);
                    webSocket.write(answer);
                }
                catch (error) {
                    console.log(`:: Got error: ${error.message}`);
                }
            }
        });
    }
}
exports.NutAdaptor = NutAdaptor;
