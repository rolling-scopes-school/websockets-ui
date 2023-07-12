import WebSocket, { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index.js";
import { commandRouter } from "./src/commands_hub/commandRouter.js";
const HTTP_PORT = 8181;

let DB = {
    players: {
        
    },
};

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer ({port : 3000});

wss.on('connection', (wsClient) => {
    wsClient.on('error', error => console.error(error));
    wsClient.on('message', (event) => {
        const [commandResponse, isForEach] = commandRouter(JSON.parse(event), wsClient);
        if (commandResponse !== undefined && !isForEach) {
            wsClient.send(commandResponse);
        } else if (commandResponse !== undefined && isForEach) {
            wss.clients.forEach( (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(commandResponse);
                }
            })
        }
    });
})

export const updateDB = (dbInstance = DB) => {
    DB = dbInstance;
    console.log(DB);
    return DB;
}