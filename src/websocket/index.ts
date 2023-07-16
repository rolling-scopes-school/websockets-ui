import { WebSocket as webSocket } from 'ws';
import * as http from 'http';
import { registerPlayer } from './register';
import { createRoom } from './createRoom';
import { players } from './db/db';
import { updateRooms } from './updateRooms';


function webSocketServer(wsPort: number | string) {

    const server = http.createServer();
    const wss = new webSocket.Server({ noServer: true });



    server.listen(wsPort, () => {
        console.log(`WS_Server started on port ${wsPort}`);
    });

    wss.on('connection', (ws: webSocket) => {
        const playerId: number = new Date().valueOf() + players.length;
        console.log(`A client connected with id:${playerId}`);

        ws.on('message', (message: string) => {
            try {
                const { type: messageType, data } = JSON.parse(message.toString())

                switch (messageType) {
                    case 'reg':
                        registerPlayer(ws, data, playerId)
                        updateRooms()
                        break;
                    case 'create_room':
                        console.log('Received message:', messageType);
                        createRoom(ws, data, playerId)
                        updateRooms()
                        break;
                    case 'single_play':
                        console.log('Received message:', messageType);
                        console.log('Received message:', data);
                        break;


                    default:
                        console.log('Unknown request type');
                        ws.send('Unknown request type')
                        break;
                }

            } catch (error) {
                console.log('error has been caught ' + error)
            }


        });

        ws.on('close', () => {
            console.log('A client disconnected');
        });
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
}


export { webSocketServer }