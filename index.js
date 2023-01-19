import { WebSocketServer } from 'ws';
import { mouse, up, down, left, right } from '@nut-tree/nut-js';

import { httpServer } from './src/http_server/index.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const directionHandlers = { up, down, left, right };

const commandHandler = async (command, params) => {
    switch (command) {
        case 'mouse_up':
        case 'mouse_down':
        case 'mouse_right':
        case 'mouse_left': {
            const [ _, direction ] = command.split('_');
            const offset = +params;

            await mouse.move(directionHandlers[direction](offset));

            return;
        }
        case 'mouse_position': {
            const point = await mouse.getPosition();

            return `${point.x},${point.y}`;
        }
        case 'draw_square': {
            break;
        }
        case 'draw_rectangle': {
            break;
        }
        case 'draw_circle': {
            break;
        }
        case 'prnt_scrn': {
            break;
        }
        default: {
            break;
        }
    }
};

const wss = new WebSocketServer({ port: 8080 });

wss.on('listening', () => {
    console.log(`WebSocket server `)
});

wss.on('connection', ws => {
    console.log(`WebSocket`)

    ws.on('message', async (data) => {
        const [ command, params ] = data.toString().split(' ');
        console.log(`Received command from client: command - ${command}, params - ${params}`);

        try {
            const result = await commandHandler(command, params);
            console.log(result)

            ws.send(command + ' ' + result);
        } catch(error) {
            console.log(error.message);
        }
    });
});


wss.on('close', () => {
    console.log('close')
});

wss.on('error', () => {
    console.log('error')
});
