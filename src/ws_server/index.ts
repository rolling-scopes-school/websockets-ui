import WebSocket from "ws";


interface Room {
    ws1: WebSocket,
    ws2: WebSocket
}


export const start_WSS = () => {



    const WSS_PORT = 3000;

    const wss = new WebSocket.Server({ port: WSS_PORT }, () => console.log('вебсокет'));

    wss.on("connection", (wsClient) =>
        wsClient.on('message', async (message) => {
            console.log(JSON.parse(message.toString()))
            wsClient.send(JSON.stringify(message))

            const examp = {
                type: "reg"
            }

            // console.log(JSON.stringify(examp))

            // wsClient.send(JSON.stringify(examp))
        }
        ))
}