import { Duplex, Writable } from 'stream'
import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws'
import { handleMessage } from './utils/handleMessage'

const port = 8080

export const startWsServer = (): WebSocket.Server => {
    const onConnect = (wsClient: WebSocket) => {
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
        port
    })

    console.log(`Start static websocket server on the ${port} port!`)

    wsServer.on('connection', onConnect)

    process.on('SIGINT', () => {
        console.log('\nserver closes connections before shut down.\n')
        wsServer.close()
        process.exit()
    })

    return wsServer
}
