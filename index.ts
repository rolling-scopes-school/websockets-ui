import { Duplex } from 'stream'
import { createWebSocketStream } from 'ws'
import {httpServer} from './src/server'
import { startWsServer } from './src/web-socket'

const HTTP_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)
startWsServer()
