import {CommandHandler} from "../models/command-handler.type.js";
import {down, left, mouse, right, up} from "@nut-tree/nut-js";

const moveMouseLeft: CommandHandler = async (offset: string) => {
    await mouse.move(left(parseInt(offset)));

    return `success mouse_left ${offset}`;
}

export const moveMouseRight: CommandHandler = async (offset: string) => {
    await mouse.move(right(parseInt(offset)));

    return `success mouse_right ${offset}`;
}

export const moveMouseUp: CommandHandler = async (offset: string) => {
    await mouse.move(up(parseInt(offset)));

    return `success mouse_up ${offset}`;
}

export const moveMouseDown: CommandHandler = async (offset: string) => {
    await mouse.move(down(parseInt(offset)));

    return `success mouse_down ${offset}`;
}

export default {
    moveMouseLeft,
    moveMouseRight,
    moveMouseUp,
    moveMouseDown,
}
