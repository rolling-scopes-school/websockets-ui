import * as fs from "fs";
import * as http from "http";
import * as path from "path";

export const httpServer = http.createServer((req, res) => {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);

  try {
    const readStream = fs.createReadStream(file_path);
    res.writeHead(200);
    readStream.pipe(res);
  } catch (error) {
    res.writeHead(404);
    res.end(JSON.stringify(error));
  }
});
