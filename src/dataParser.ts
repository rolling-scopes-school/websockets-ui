import stream from 'stream';
import robot from 'robotjs';

export const dataParser = ( action: string, height: number, width: number, duplex: stream.Duplex) => {
    const { x, y } = robot.getMousePos();

    switch(action){
        case 'mouse_position':
            duplex.write(`mouse_position ${x},${y} \0`, 'utf-8');
            console.log(`"mouse_position" completed!\n`);
            break;
        case 'mouse_left':
            
            
    }

}