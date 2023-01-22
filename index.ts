import { env } from 'node:process';
import { config } from 'dotenv';
import { createWebSocketStream, WebSocketServer } from 'ws';
import { getActiveWindow } from '@nut-tree/nut-js';

import { Command } from './src/enums';
import { httpServer } from './src/http_server';
import { Commander } from './src/commander';

config();

console.log(`Start static http server on the ${env.HTTP_PORT} port!`);
httpServer.listen(env.HTTP_PORT);

// (async () => {
//     mouse.config.mouseSpeed = 2000;

//     await mouse.move(left(500));
//     await mouse.move(up(500));
//     await mouse.move(right(500));
//     await mouse.move(down(500));

//     const target = new Point(500, 350);

//     await mouse.move(straightTo(target));

//     const newTarget = new Point(1500, 350);

//     await mouse.setPosition(newTarget);
// })();

const wss = new WebSocketServer({ port: +env.WSS_PORT! });

wss.on('connection', async (ws) => {
  const duplex = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });
  const windowRef = await getActiveWindow();
  const [title, region] = await Promise.all([
    windowRef.title,
    windowRef.region
  ]);

  console.log(region.toString());

  duplex.on('data', (data: string) => {
    const [command, value] = data.toString().split(' ') as [Command, string];
    const commander = new Commander(command, +value);
    const response = commander.getResponseMessage();

    duplex.write(response);
  });

  // ws.on('message', async (data: any) => {
  //   const [command, value] = data.toString().split(' ') as [Command, string];
  //   const commander = new Commander(command, +value);
  //   const response = commander.getResponseMessage();

  //   ws.send(response);

  //   console.log('received: %s', data);
  // });

  duplex.pipe(process.stdout);
  process.stdin.pipe(duplex);
});
