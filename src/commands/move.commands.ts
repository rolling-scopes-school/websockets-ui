import {CommandHandler} from "../models/command-handler.type.js";
import {left, mouse} from "@nut-tree/nut-js";

const moveMouseLeft: CommandHandler = async (offset: string) => {
    await mouse.move(left(parseInt(offset)));

    return `success mouse_left ${offset}`;
}

export default {
    moveMouseLeft
}
