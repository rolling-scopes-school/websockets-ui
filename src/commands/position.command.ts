import {mouse} from "@nut-tree/nut-js";
import {CommandHandler} from "../models/command-handler.type.js";

export const sendMousePosition: CommandHandler = async (_, ws) => {
    const position = await mouse.getPosition();

    ws.write(`mouse_position ${position.x},${position.y}`)

    return `success mouse_position ${position.x} ${position.y}`;
}
