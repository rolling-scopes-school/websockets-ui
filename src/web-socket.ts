import WebSocket, { WebSocketServer } from 'ws'
import { handleMessage } from './utils/handleMessage'

export const startWsServer = (): WebSocket.Server => {
    function onConnect(wsClient: WebSocket) {
        console.log(`Client connected`)
        wsClient.on('message', async (message: WebSocket.MessageEvent) => {
            console.log('user send message')
            const parsedMessage = message.toString()
            console.log(parsedMessage)
            const result = await handleMessage(parsedMessage)
            wsClient.send(result)
        })
        wsClient.on('close', () => {
            console.log('user disconnected')
        })
    }

    const wsServer = new WebSocketServer({
        port: 8080
    })


    wsServer.on('connection', onConnect)

    return wsServer
}
