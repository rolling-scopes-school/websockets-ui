import fs from 'fs';
import path from 'path';
import { createServer, IncomingMessage, ServerResponse, Server } from 'http';

export const httpServer: Server = createServer((req: IncomingMessage, res: ServerResponse): void => {
  const __dirname: string = path.resolve(path.dirname(''));
  const file_path: string = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, (err: NodeJS.ErrnoException, data: Buffer) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});
