import fs from "fs";
import path from "path";
import http, { IncomingMessage, ServerResponse } from 'http';

export const httpServer = http.createServer(function (req: IncomingMessage, res: ServerResponse) {
  const __dirname: string = path.resolve(path.dirname(""));
  const file_path: string = __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);

  fs.readFile(file_path, function (err: any, data: any) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }

    res.writeHead(200);
    res.end(data);
  });
});
