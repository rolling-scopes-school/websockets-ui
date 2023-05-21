import {CommandHandler} from "../models/command-handler.type.js";
import {Command} from "../models/command.type.js";
import MoveCommands from "./move.commands.js";

export const commands: Record<Command, CommandHandler> = {
    mouse_left: async (offset: string) => MoveCommands.moveMouseLeft(offset),
    mouse_right: async () => 'mouse_right',
    mouse_down: async () => 'mouse_down',
    mouse_up: async () => 'mouse_up',
    mouse_position: async () => 'mouse_position',
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
