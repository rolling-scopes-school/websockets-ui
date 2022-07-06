import stream from 'stream';
import robot from 'robotjs';
import { prntScrn } from './prntScrn';
import { drawRectangle } from './drawRectangle';
import { drawSquare } from './drawSquare';
import { drawCircle } from './drawCircle';

export const dataParser = async (action: string, height: number, width: number, duplex: stream.Duplex) => {
    const { x, y } = robot.getMousePos();

    switch (action) {
        case 'mouse_position':
            duplex.write(`mouse_position ${x},${y} \0`, 'utf-8');
            console.log(`"mouse_position" completed!\n`);
            break;
        case 'mouse_left':
            duplex.write(`mouse_left \0`, 'utf-8');
            robot.moveMouse(-width + x, y);
            console.log(`"mouse_left" completed!\n`);
            break;
        case 'mouse_right':
            duplex.write(`mouse_right \0`, 'utf-8');
            robot.moveMouse(width + x, y);
            console.log(`"mouse_right" completed successfully!\n`);
            break;
        case 'mouse_down':
            duplex.write(`mouse_down \0`, 'utf-8');
            robot.moveMouse(x, width + y);
            console.log(`"mouse_down" completed!\n`);
            break;
        case 'mouse_up':
            duplex.write(`mouse_up \0`, 'utf-8');
            robot.moveMouse(x, -width + y);
            console.log(`"mouse_up" completed!\n`);
            break;
        case 'prnt_scrn':
            const base64 = await prntScrn(x, y);
            duplex.write(`prnt_scrn ${base64} \0`, 'utf-8');
            console.log(`"prnt_scrn" completed!\n`);
            break;
        case 'draw_circle':
            drawCircle(duplex, x, y, width);
            console.log(`"draw_circle" completed!\n`);
            break;
        case 'draw_square':
            drawSquare(duplex, x, y, width);
            console.log(`"draw_square" completed!\n`);
            break;
        case 'draw_rectangle':
            drawRectangle(duplex, x, y, width, height);
            console.log(`draw_rectangle" completed !\n`);
            break;
        default:
            console.log(`Action failed!\n`);
            break;
    }
}