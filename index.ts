import { httpServer } from "./src/http_server";
import { WebSocketServer } from 'ws';
import { mouse, left, right, up, down, straightTo, Point, getActiveWindow } from "@nut-tree/nut-js";

import { Command } from "./src/enums";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

// (async () => {
//     mouse.config.mouseSpeed = 2000;

//     await mouse.move(left(500));
//     await mouse.move(up(500));
//     await mouse.move(right(500));
//     await mouse.move(down(500));

//     const target = new Point(500, 350);
    
//     await mouse.move(straightTo(target));

//     const newTarget = new Point(1500, 350);

//     await mouse.setPosition(newTarget);
// })();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async (ws) => {
    const windowRef = await getActiveWindow();
    const [title, region] = await Promise.all([windowRef.title, windowRef.region]);

    console.log(region.toString());

    ws.on('message', async (data) => {
        const [command, value] = data.toString().split(' ');
        let response = '';

        switch (command) {
            case (Command.MOUSE_POSITION):
                const { x, y } = await mouse.getPosition();
                response = `${Command.MOUSE_POSITION} ${x},${y}`;
                break;
            case (Command.MOUSE_UP):
                mouse.move(up(+value));
                response = command;
                break;
            case (Command.MOUSE_DOWN):
                mouse.move(down(+value));
                response = command;
                break;
            case (Command.MOUSE_LEFT):
                mouse.move(left(+value));
                response = command;
                break;
            case (Command.MOUSE_RIGHT):
                mouse.move(right(+value));
                response = command;
                break;
            case (Command.DRAW_SQUARE):
                // await mouse.drag();
                break;
        }

        ws.send(response);

        console.log('received: %s', data);
    });
});