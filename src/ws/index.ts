import { WebSocketServer } from 'ws';
import config from '../config';
import { handleCommand } from '../handleCommand';

const DEFAULT_PORT = 8080;

const port = config.port ? +config.port : DEFAULT_PORT;



export const startWebSocket = () => {
  const wsserver  = new WebSocketServer({ port: 8080 });

  if(wsserver) {
    console.log('Waiting for connection..');
  } else {
    console.log('Websocket does not work');
  }
  
  wsserver.on('connection', (ws) => {
    console.log('connection!');
    ws.on('message', async (data) => {
      console.log('received: %s', data);
      try {

        await handleCommand(data.toString());
      } catch(e) {
        console.log(`Error ${(e as Error).message} in command ${data} `);
      }
      

    });
  
    ws.send('something');
  });
}





