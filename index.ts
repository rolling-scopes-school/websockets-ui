import Jimp from 'jimp';
import {httpServer} from './src/http_server/index';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { MOUSE_UP, MOUSE_DOWN, MOUSE_LEFT, 
  MOUSE_RIGHT, MOUSE_POSITION, DRAW_CIRCLE, DRAW_SQUARE, DRAW_RECTANGLE, PRNT_SCRN
} from './src/utils/helpers';
import { mouseUp, mouseDown, mouseLeft, mouseRight } from './src/navigation/index';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 8080}, () => console.log('Server started on 8080'));

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      const input = data.toString();
      const mouseControl = parseInt(input.match(/\d+/));
      const { x, y }= robot.getMousePos()
      
      if(input.includes(MOUSE_UP)) {
        ws.send(MOUSE_UP)
        mouseUp(x, y, mouseControl)
      } else if(input.includes(MOUSE_DOWN)){
        ws.send(MOUSE_DOWN)
        mouseDown(x, y, mouseControl)
      } else if( input.includes(MOUSE_LEFT)) {
        ws.send(MOUSE_LEFT)
        mouseLeft(x, y, mouseControl)
      } else if(input.includes(MOUSE_RIGHT)) {
        ws.send(MOUSE_RIGHT)
        mouseRight(x, y, mouseControl)
      } else if(input.includes(MOUSE_POSITION)) {
        ws.send(`${MOUSE_POSITION},x=${x}px,y=${y}px`)
      } else if(input.includes(DRAW_CIRCLE)) {
        ws.send(DRAW_CIRCLE)
      } else if(input.includes(DRAW_SQUARE)) {
        ws.send(DRAW_SQUARE)
      } else if(input.includes(DRAW_RECTANGLE)) {
        ws.send(DRAW_RECTANGLE)  
      } else if(input.includes(PRNT_SCRN)) {
          ws.send(PRNT_SCRN)
      } else {
        console.log('You are inside else')
      }
    });
    ws.send('something');
  
  });

  wss.on('close', () => {
    console.log('disconnected');
  })