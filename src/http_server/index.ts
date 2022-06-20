import { readFile } from "fs";
import { resolve, dirname } from "path";
import { createServer } from "http";

export const httpServer = createServer(function (req, res) {
  const __dirname = resolve(dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});
