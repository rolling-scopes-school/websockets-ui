import WebSocket from 'ws'
import { httpServer } from './server'
import robot from 'robotjs'
import { getNewMousePosition } from './utils/getNewMousePosition'

export const startWsServer = (): WebSocket.Server => {
    function onConnect(wsClient: WebSocket) {
        console.log(`Client connected`)
        wsClient.on('message', (message: WebSocket.MessageEvent) => {
            console.log('user send message')
            const parsedMessage = message.toString()
            console.log(parsedMessage)
            switch (true) {
                case parsedMessage === 'mouse_position': {
                    const { x, y } = robot.getMousePos()
                    wsClient.send(`mouse_position ${[x, y]}`)
                    break
                }
                case parsedMessage.startsWith('mouse_'): {
                    const { x, y } = robot.getMousePos()
                    const [ newX, newY ] = getNewMousePosition(parsedMessage, x, y)
                    wsClient.send('mouse_move')
                    robot.moveMouse(newX, newY)
                    break
                }
                default:
                    wsClient.send('unknow_command')
                    console.log('unknow command')
                    break
            }
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
