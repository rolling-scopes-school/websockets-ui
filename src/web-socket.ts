import WebSocket from 'ws'
import { httpServer } from './server'
import { handleMessage } from './utils/handleMessage'

export const startWsServer = (): WebSocket.Server => {
    function onConnect(wsClient: WebSocket) {
        console.log(`Client connected`)
        wsClient.on('message', (message: WebSocket.MessageEvent) => {
            console.log('user send message')
            const parsedMessage = message.toString()
            console.log(parsedMessage)
            wsClient.send(handleMessage(parsedMessage))
        })
        wsClient.on('close', () => {
            console.log('user disconnected')
        })
    }

    const wsServer = new WebSocket.WebSocketServer({
        server: httpServer,
    })

    wsServer.on('connection', onConnect)

    return wsServer
}
