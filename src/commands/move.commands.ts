import {CommandHandler} from "../models/command-handler.type.js";
import {down, left, mouse, right, up} from "@nut-tree/nut-js";

const normalizeOffset = (value: string | undefined): number => {
    if (!value) {
        throw new Error(`Incorrect offset`);
    }

    return parseInt(value);
}

const moveMouseLeft: CommandHandler = async ([offset]) => {
    await mouse.move(left(normalizeOffset(offset)));

    return `success mouse_left ${offset}`;
}

export const moveMouseRight: CommandHandler = async ([offset]) => {
    await mouse.move(right(normalizeOffset(offset)));

    return `success mouse_right ${offset}`;
}

export const moveMouseUp: CommandHandler = async ([offset]) => {
    await mouse.move(up(normalizeOffset(offset)));

    return `success mouse_up ${offset}`;
}

export const moveMouseDown: CommandHandler = async ([offset]) => {
    await mouse.move(down(normalizeOffset(offset)));

    return `success mouse_down ${offset}`;
}

export default {
    moveMouseLeft,
    moveMouseRight,
    moveMouseUp,
    moveMouseDown,
}
