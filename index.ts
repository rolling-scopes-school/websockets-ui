import { env } from 'node:process';
import { config } from 'dotenv';
import { createWebSocketStream, WebSocketServer } from 'ws';

import { Command } from './src/enums';
import { httpServer } from './src/http_server';
import { Commander } from './src/commander';

config();

console.log(`Start static http server on the ${env.HTTP_PORT} port!`);
httpServer.listen(env.HTTP_PORT);

const wss = new WebSocketServer({ port: +env.WSS_PORT! });
console.log(`Start ws server on ${env.HOST} host and ${env.WSS_PORT} port!`);

wss.on('connection', async (ws) => {
  const duplex = createWebSocketStream(ws, {
    encoding: 'utf8',
    decodeStrings: false
  });

  duplex.on('data', async (data: string) => {
    const [command, value, figureLength] = data.toString().split(' ') as [
      Command,
      string,
      string
    ];
    const commander = new Commander();
    await commander.handleCommand(command, +value, +figureLength ?? null);
    const response = commander.getResponseMessage();
    duplex.write(response);
    console.log(response === command ? `${response}: OK` : response);
  });
});

process.on('SIGINT', () => {
  wss.close();
  httpServer.close();
});
