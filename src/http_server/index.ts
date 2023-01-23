import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { mouse, Point, Button } from "@nut-tree/nut-js";

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

const wss = new WebSocketServer({ port: 5000 });

wss.on('connection', async function connection(ws) {
    ws.on('message', async function message(data) {
        console.log('received command: %s', data);
        let position = await mouse.getPosition();
        console.log(`current mouse position is ${position}`);
        const array = data.toString().split(' ');
        if (array[0] === 'mouse_right') {
            position.x = position.x + Number(array[1]);
            await mouse.move([position]);
            console.log(`result: mouse moved right. New position is ${position}`);
            ws.send(`mouse_right ${position.x},${position.y}`);
        }
        if (array[0] === 'mouse_left') {
            position.x = position.x - Number(array[1]);
            await mouse.move([position]);
            console.log(`result: mouse moved left. New position is ${position}`);
            ws.send(`mouse_left ${position.x},${position.y}`);
        }
        if (array[0] === 'mouse_up') {
            position.y = position.y - Number(array[1]);
            await mouse.move([position]);
            console.log(`result: mouse moved up. New position is ${position}`);
            ws.send(`mouse_up ${position.x},${position.y}`);
        }
        if (array[0] === 'mouse_down') {
            position.y = position.y + Number(array[1]);
            await mouse.move([position]);
            console.log(`result: mouse moved down. New position is ${position}`);
            ws.send(`mouse_down ${position.x},${position.y}`);
        }
        if (array[0] === 'mouse_position') {
            console.log(`result: current mouse coordinates are ${position}`);
            ws.send(`mouse_position ${position.x},${position.y}`);
        }
        if (array[0] === 'draw_rectangle') {
            ws.send(`draw_rectangle`);
        }
        if (array[0] === 'draw_circle') {
            ws.send(`draw_circle`);
        }
        if (array[0] === 'draw_square') {
            await mouse.pressButton(Button.LEFT);
            await mouse.move([
                position,
                new Point(position.x + Number(array[1]), position.y),
                new Point(position.x + Number(array[1]), position.y + Number(array[1])),
                new Point(position.x, position.y + Number(array[1])),
                position,
            ]);
            await mouse.releaseButton(Button.LEFT);
            ws.send(`draw_square`);
        }
    });

    console.log('established WS connection on port: %s', wss.options.port);
});
