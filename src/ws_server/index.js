import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  //const ip = req.socket.remoteAddress;
  //console.log('ip: ', ip);

  //console.log('ws.readyState: ', ws.readyState);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send('!!!');
  });

});

wss.on("close", () => { console.log('Disconnected!')});
