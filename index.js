import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 8000 });

const drawCircle = radius => {
    const mousePos = robot.getMousePos();

    robot.moveMouse(mousePos.x + radius * Math.cos(0), mousePos.y + radius * Math.sin(0))
    robot.mouseToggle('down')
    for (let i = 0; i <= Math.PI * 2; i += 0.02) {
        const x = mousePos.x + radius * Math.cos(i);
        const y = mousePos.y + radius * Math.sin(i);

        robot.dragMouse(x, y);
    }
    robot.mouseToggle('up')
};

const drawRectangle = (x, y) => {
    const mousePos = robot.getMousePos();

    robot.mouseToggle('down')

    robot.moveMouse(mousePos.x + x, mousePos.y)
    robot.moveMouse(mousePos.x + x, mousePos.y + y)
    robot.moveMouse(mousePos.x, mousePos.y + y)
    robot.moveMouse(mousePos.x, mousePos.y)

    robot.mouseToggle('up')
}

wss.on('connection', ws => {
    console.log('Connection accepted!')
    ws.on('message', data => {
        console.log('message data: %s', data)

        const values = data.toString().trim().split(' ');
        console.log('data values', values);
        const mousePos = robot.getMousePos()

        switch (values[0]) {
            case 'mouse_up':
                robot.moveMouse(mousePos.x, mousePos.y - Number(values[1]));
                break
            case 'mouse_down':
                robot.moveMouse(mousePos.x, mousePos.y + Number(values[1]));
                break
            case 'mouse_left':
                robot.moveMouse(mousePos.x - Number(values[1]), mousePos.y);
                break
            case 'mouse_right':
                robot.moveMouse(mousePos.x + Number(values[1]), mousePos.y);
                break
            case 'mouse_position':
                ws.send(`mouse_position ${mousePos.x},${mousePos.y}`)
                break
            case 'draw_circle':
                const radius = values[1];
                drawCircle(radius)
                break
            case 'draw_rectangle':
                const x = +values[1];
                const y = +values[2];
                drawRectangle(x, y)
                break;
            case 'draw_square':
                const xLength = +values[1];
                drawRectangle(xLength, xLength)
                break;
            case 'prnt_scrn':
                const img = robot.screen.capture(robot.getMousePos().x - 100, robot.getMousePos().y - 100, 200, 200).image
                new Jimp({ data: img, width: 200, height: 200 }, (err, image) => {

                    let pos = 0;
                    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                        image.bitmap.data[idx + 2] = img.readUInt8(pos++);
                        image.bitmap.data[idx + 1] = img.readUInt8(pos++);
                        image.bitmap.data[idx + 0] = img.readUInt8(pos++);
                        image.bitmap.data[idx + 3] = img.readUInt8(pos++);
                    });

                    image.getBase64(Jimp.MIME_PNG, (err, img) => {

                        ws.send(`prnt_scrn ${img.split(',')[1]}`)
                    })
                });

                break;
        }
    })

    ws.send('something')
})

process.on('SIGINT', () => {
    process.stdout.write('Closing websocket...\n');
    wss.close();
    process.exit(0);
});
