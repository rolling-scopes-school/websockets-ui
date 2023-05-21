import {CommandHandler} from "../models/command-handler.type.js";
import {Command} from "../models/command.type.js";
import MoveCommands from "./move.commands.js";
import { sendMousePosition } from "./position.command.js";

export const commands: Record<Command, CommandHandler> = {
    mouse_left: MoveCommands.moveMouseLeft,
    mouse_right: MoveCommands.moveMouseRight,
    mouse_down: MoveCommands.moveMouseDown,
    mouse_up: MoveCommands.moveMouseUp,
    mouse_position: sendMousePosition,
    draw_square: async () => 'draw_square',
    draw_rectangle: async () => 'draw_rectangle',
    draw_circle: async () => 'draw_circle',
    prnt_scrn: async () => 'prnt_scrn',
}

const notFoundHandler: CommandHandler = async () => 'Command not found';

const getCommandHandler = (command: string): CommandHandler => commands[command as unknown as Command] ?? notFoundHandler;

export {
    getCommandHandler,
}
