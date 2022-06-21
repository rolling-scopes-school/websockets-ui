import fs, { ReadStream } from 'fs';
import path from 'path';
import http, { IncomingMessage,Server, ServerResponse } from 'http';

export const httpServer:Server = http.createServer((req:IncomingMessage, res:ServerResponse):void=> {
    const __dirname:string = path.resolve(path.dirname(''));
    const file_path:string = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    
    const readFile:ReadStream = fs.createReadStream(file_path)

    let html:string = ''

    readFile.on("data",( data:string )=>{
        html += data
    })

    readFile.on('end',()=>{
        res.writeHead(200,{'Content-type':'text/html'})
        res.end(html)
    })

    readFile.on("error",( err:Error ) => {
        res.writeHead(404);
        res.end(JSON.stringify(err));
    })
});