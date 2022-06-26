import { Duplex } from 'stream'
import { createWebSocketStream } from 'ws'
import {httpServer} from './src/server'
import { startWsServer } from './src/web-socket'

const httpPort = 3000

console.log(`Start static http server on the ${httpPort} port!`)
httpServer.listen(httpPort)

// try {
    startWsServer()
// }
// catch(e) {
//     console.log('error', e)
// }
