const { WebSocketServer } = require("ws");


class WS_connection {
    constructor(WSS_PORT = 3000) {
        this.WS_PORT = WSS_PORT;
        this.sockets = [];
    }

    startConnection() {
        const wss = new WebSocketServer({ port: this.WS_PORT }, () =>
            console.log("Start Web Socket server on the 3000 port!")
        );

        wss.on("connection", (wsClient) => {
            console.log("connection", wsClient);
            this.sockets.push(wsClient);

            wsClient.index = Math.floor(Math.random() * Date.now());

            wsClient.on('message', async (message) => {
                const frontRes = JSON.parse(message.toString());
                console.log('message', frontRes);
                // requestProcessing(message, wsClient);
            });

            wsClient.on('close', async (message) => {
                console.log('close', message);
                // Object.keys(games).map((index) => games[Number(index)].closeSocket(wsClient.index))
            });
        });
    }
}

module.exports = { WS_connection };