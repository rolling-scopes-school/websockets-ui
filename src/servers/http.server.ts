import http from "http";
import path from "path";
import fs from "fs";

export const startHttpServer = (port: number, listenCb: VoidFunction): http.Server =>{
    const httpServer = http.createServer(function (req, res) {
        const __dirname = path.resolve(path.dirname(''));
        const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
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

    httpServer.listen(port, listenCb);

    return httpServer;
}
