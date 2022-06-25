import { httpServer } from './src/http_server/index';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { Buffer } from 'buffer';
import Jimp from 'jimp';
import { drawCircle, drawSquare, drawRectangle } from './src/actions/drawing';
import { printScreen } from './src/actions/printScreen'

const HTTP_PORT = 3000;

httpServer.listen(HTTP_PORT)
console.log(`Static http server started on http://localhost:${HTTP_PORT}`);

const WS_PORT = 8080;
const server = new WebSocketServer({ port: WS_PORT });

server.on('connection', (socket) => {
  socket.send(`${WS_PORT}\0`);

  socket.on('message', (data) => {
    const packet: String = data.toString();
    console.log('message: ', packet);
    const { x, y } = robot.getMousePos();
    const distance: number = Number(packet.split(' ').pop());
    // console.log(distance);

    switch (packet.split(' ')[0]) {
      case 'mouse_up':
        robot.moveMouse(x, y - distance);
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'mouse_down':
        robot.moveMouse(x, y + distance);
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'mouse_left':
        robot.moveMouse(x - distance, y);
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'mouse_right':
        robot.moveMouse(x + distance, y);
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'draw_circle':
        drawCircle(distance);
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'draw_rectangle': ;
        drawRectangle(Number(packet.split(' ')[1]), Number(packet.split(' ')[2]));
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'draw_square':
        drawSquare(distance);
        socket.send(`mouse_position_${x},${y}\0`);
        break;
      case 'print_screen': ;
        break;
    }

  
    // socket.send(`mouse_position ${mousePos.x, mousePos.y}`);
  })

  socket.on('close', () => {
    console.log('closed the connection');
  })
})
