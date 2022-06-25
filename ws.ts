import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';
import robot from 'robotjs';
import jimp from 'jimp';

const socket = new WebSocket('ws://localhost:8080');
const wss = new WebSocketServer({ port: 8080 });

const screenCaptureToFile2 = (robotScreenPic: robot.Bitmap, ws: WebSocket.WebSocket) => {
  return new Promise(async (resolve: any, reject) => {
      try {
          const image = new jimp(robotScreenPic.width, robotScreenPic.height);
          let pos = 0;
          image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
              image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
              image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
              image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
              image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
          });
          let base64: string | string[] = await image.getBase64Async(jimp.MIME_PNG);

          base64 = base64.split(',')
          base64.shift();
          base64 = base64.join();
          
          ws.send(`prnt_scrn ${base64}`);

      } catch (e) {
          console.error(e);
          reject(e);
      }
  });
}


const drawCircle = (radius: string) => {
  console.log(100 + radius);
  const mousePos = robot.getMousePos();

  for (let i = 0; i <= Math.PI * 2 + 0.1; i += 0.1) {
    robot.mouseToggle('down');

    const x = mousePos.x - 100 + +radius * Math.cos(i);
    const y = mousePos.y + +radius * Math.sin(i);

    robot.dragMouse(x, y);
  }
};

const drawSquare = (width: string) => {
  robot.setMouseDelay(100);
  [
    [+width, 0],
    [0, +width],
    [-width, 0],
    [0, -width]
  ].forEach((arr) => {
    const mousePos = robot.getMousePos();
    robot.mouseToggle('down');

    const x = mousePos.x + arr[0];
    const y = mousePos.y + arr[1];

    robot.dragMouse(x, y);
  });
};

const drawRectangle = (value: string) => {
  const [width, length] = value.split(' ');
  robot.setMouseDelay(100);

  console.log(value.split(' '));
  [
    [+width, 0],
    [0, +length],
    [-width, 0],
    [0, -length]
  ].forEach((arr) => {
    const mousePos = robot.getMousePos();
    robot.mouseToggle('down');

    const x = mousePos.x + arr[0];
    const y = mousePos.y + arr[1];

    robot.dragMouse(x, y);
  });
};


wss.on('headers', (data) => {
  console.log(data);
});

wss.on('connection', (ws) => {
  const duplex = createWebSocketStream(ws, {
    encoding: 'utf-8',
    decodeStrings: false
  });

  duplex.on('data', (chunk) => {
    const [command, value] = chunk.toString().split(' ');
    let mouse = robot.getMousePos();

    switch(command){
      case 'mouse_up':
        let limitValue = +value;
        limitValue > mouse.y ? (limitValue = mouse.y - 1) : limitValue;
        robot.moveMouse(mouse.x, mouse.y - limitValue);
        duplex.write(`${command}\0`);
    }

    if (command === 'mouse_position') {
      let { x, y } = robot.getMousePos();
      const message = `mouse_position ${x},${y}`;
      duplex.write(`${command} ${x},${y}\0`);
    }
  });


  console.log('New user');
  const screenSize = robot.getScreenSize();

  ws.on('message', async (data) => {
    console.log('received: %s', data);
    const dataArray = data.toString().split(' ');
    const [command, value] = [dataArray.shift(), dataArray.join(' ')];
    let mouse = robot.getMousePos();

    // if (command === 'mouse_up') {
    //   let limitValue = +value;
    //   limitValue > mouse.y ? (limitValue = mouse.y - 1) : limitValue;
    //   robot.moveMouse(mouse.x, mouse.y - limitValue);
    // } else 
    if (command === 'mouse_down' && mouse.y < screenSize.height - 25) {
      robot.moveMouse(mouse.x, mouse.y + +value);
    } else if (command === 'mouse_left') {
      let limitValue = +value;
      limitValue > mouse.y ? (limitValue = mouse.x - 1) : limitValue;
      robot.moveMouse(mouse.x - +value, mouse.y);
    } else if (command === 'mouse_right' && mouse.x < screenSize.width - 15) {
      robot.moveMouse(mouse.x + +value, mouse.y);
    } else if (command === 'draw_circle') {
      drawCircle(value);
      robot.mouseToggle('up');
    } else if (command === 'draw_square') {
      drawSquare(value);
      robot.mouseToggle('up');
    } else if (command === "draw_rectangle") {
      drawRectangle(value);
      robot.mouseToggle('up');
    } else if (command === "prnt_scrn") {
      var bitMap = robot.screen.capture(mouse.x, mouse.y, 200, 200);
      screenCaptureToFile2(bitMap, ws)

      // ws.send(`prnt_scrn ${base64}`);
    }
  });
  ws.send(`hello`);
});

wss.on('error', (error) => {
  console.log(error);
});

wss.on('close', () => {
  console.log('close');
});

process.on( "SIGINT", function() {
  console.log( "\ngracefully shutting down from SIGINT (Crtl-C)" );
  
  socket.close();

  process.exit();
} );

