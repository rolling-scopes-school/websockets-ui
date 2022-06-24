import { Duplex, Writable } from 'stream'
import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws'
import { handleMessage } from './utils/handleMessage'

export const startWsServer = (): WebSocket.Server => {
    function onConnect(wsClient: WebSocket) {
        console.log(`Client connected`)
        const duplex: Duplex = createWebSocketStream(wsClient, {
            encoding: 'utf8',
            decodeStrings: false
        })
        const writeStream = new Writable({
            async write(data, encoding, callback) {
                const parsedMessage = data.toString('utf8').trim()
                console.log('user send message')
                console.log(parsedMessage)
                const result = await handleMessage(parsedMessage)
                duplex.write(result)
                callback()
            }
        })
        duplex.pipe(writeStream)
    }

    const wsServer = new WebSocketServer({
        port: 8080
    })

    wsServer.on('connection', onConnect)

    wsServer.on('close', () => {
        console.log('user disconnected')
    })

    return wsServer
}
