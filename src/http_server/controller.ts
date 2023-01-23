import { mouse, left, up, down, right, Point } from "@nut-tree/nut-js";
import WebSocket, { WebSocketServer } from "ws";
import { Commands } from "../../src/app/constants";


export const socketConnection = async () => {
    const socket = new WebSocketServer({ port: 8080 });

    socket.on('connection', async function connection(ws) {
        ws.on('message', async (data) => {
            console.log('received: %s', data);
            const [command, value, value2, ...rest] = data.toString().split(" ");


            switch (command) {
                case Commands.mouse_up: {
                    await mouse.move(up(+value));
                    sendData(ws, `${Commands.mouse_up}_${value}`);
                    break;
                }
                case Commands.mouse_down: {
                    await mouse.move(down(+value));
                    sendData(ws, `${Commands.mouse_down}_${value}`);
                    break;
                }
                case Commands.mouse_left: {
                    await mouse.move(left(+value));
                    sendData(ws, `${Commands.mouse_left}_${value}`);
                    break;
                }
                case Commands.mouse_right: {
                    await mouse.move(right(+value));
                    sendData(ws, `${Commands.mouse_right}_${value}`);
                    break;
                }
                case Commands.mouse_position: {
                    const mousePosition = await mouse.getPosition();
                    const string = `${Commands.mouse_position} {${mousePosition.x}},{${mousePosition.y}}`;

                    sendData(ws, string);
                    break;
                }
                case Commands.draw_square: {
                    (async () => {
                        await mouse.move(right(+value));
                        await mouse.move(down(+value));
                        await mouse.move(left(+value));
                        await mouse.move(up(+value));
                    })();

                    const string = `${Commands.draw_square}_${value}`;

                    sendData(ws, string);
                    break;
                }
                case Commands.draw_rectangle: {
                    (async () => {
                        await mouse.move(right(+value));
                        await mouse.move(down(+value2));
                        await mouse.move(left(+value));
                        await mouse.move(up(+value2));
                    })();

                    const string = `${Commands.draw_square}_${value}_${value2}`;

                    sendData(ws, string);
                    break;
                }
                case Commands.draw_circle: {
                    const mousePosition = await mouse.getPosition();
                    (async () => {
                        const circleRadius = +value;
                        let x = mousePosition.x;
                        let y = mousePosition.y;
                        const path: Point[] = [];
                        for (var i = 0; i <= 100; i++) {
                            const a = 2 * Math.PI * i / 100;
                            x = mousePosition.x + circleRadius * Math.cos(a) + circleRadius;
                            y = mousePosition.y + circleRadius * Math.sin(a) + circleRadius;
                            // console.log();
                            path.push({ x, y })
                        }
                        await mouse.move(path);
                    })();

                    const string = `${Commands.draw_circle}_${value}`;

                    sendData(ws, string);
                    break;
                }
                default: {
                    ws.send('Connected');
                    break;
                }
            }

        });
        
        ws.on('close', () => {
            ws.send('connection closed');
            console.log(`connection closed`);
        });

        ws.on('error', (err) => {
            console.log(`Error occurred: ${err.message}`);
        });

    });
}

function sendData(ws: WebSocket.WebSocket, data: string) {

    ws.send(data);
}