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
    console.log('Connection established');
    ws.on('message', async (data) => {
      console.log('--> %s', data);
      try {

        const result = await handleCommand(data.toString());
        
        if (result) {
          console.log(`<-- ${result}`);
          ws.send(result);
        } else {
          ws.send(`${data}`);
        }
      } catch(e) {
        console.log(`Error ${(e as Error).message} in command ${data} `);
      }
      

    });
  
    
  });
}





