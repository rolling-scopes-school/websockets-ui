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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRouter = void 0;
const nutAdaptor_1 = require("../nutAdaptor");
class CommandRouter {
    constructor() {
        this.commands = new Map();
        this.adaptor = new nutAdaptor_1.NutAdaptor();
        this.register("mouse_position", this.adaptor.mousePosition);
        this.register("mouse_up", this.adaptor.mouseUp);
        this.register("mouse_down", this.adaptor.mouseDown);
        this.register("mouse_left", this.adaptor.mouseLeft);
        this.register("mouse_right", this.adaptor.mouseRight);
        this.register("draw_rectangle", this.adaptor.drawRectangle);
        this.register("draw_square", this.adaptor.drawSquare);
        this.register("draw_circle", this.adaptor.drawCircle);
        this.register("prnt_scrn", this.adaptor.printScreen);
    }
    register(name, cmd) {
        this.commands.set(name, cmd);
    }
    isExist(name) {
        return this.commands.has(name) ? true : false;
    }
    execute(name, wsStream, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.commands.get(name)(wsStream, ...args);
        });
    }
}
exports.CommandRouter = CommandRouter;
