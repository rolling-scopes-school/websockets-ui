import { WebSocket, createWebSocketStream } from "ws";
import { Transform } from 'stream';

import { messageHandler } from "./messageHandler";

// const onSocketConnection = (instant: WebSocket) => {
//   const duplex = createWebSocketStream(instant, { encoding: 'utf8' });
//   const transform = new Transform({
//     transform: async (chunk, encoding, callback) => {
//       console.log({chunk});
      
//         const transformed = await messageHandler(chunk);
//         console.log({transformed});
        
//         callback(null, transformed)
//     }
//   })

//   duplex.pipe(transform);
//   transform.pipe(duplex);
// }

// export default onSocketConnection;