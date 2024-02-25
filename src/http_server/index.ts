import * as fs from 'node:fs';
import * as path from 'node:path';
import * as http from 'node:http';
import { handleWsMessageEvent, wsServer } from 'ws_server';
import crypto from 'node:crypto';
import { WebSocket } from 'ws';
import { IClients } from '../../types';

const clients = {} as IClients;

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path =
    __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

wsServer.on('connection', (ws: WebSocket) => {
  // Generate a unique code for every user
  const userId = crypto.randomUUID();
  console.log(`Received a new connection.`);

  // Store the new connection
  clients[userId] = { ws, wins: 0, userName: '' };
  console.log(`Client ${userId} connected.`);

  // Handle messages from clients
  handleWsMessageEvent(ws, userId, clients);

  ws.on('error', console.error);

  ws.on('close', () => console.log(`Client ${userId} disconnected`));
});
