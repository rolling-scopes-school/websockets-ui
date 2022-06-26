import fs from 'fs';
import http from 'http';
import path from 'path';

export const httpServer = http.createServer(function (req, res) {
  const dirname = path.resolve(path.dirname(''));
  const filePath = `${dirname}/front${req.url === '/' ? '/index.html' : req.url}`;

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});
