import { TransformMessage } from "./transform";
import { WriteMsg } from './write';
import stream from 'stream';
import WebSocket from "ws";

export function onConnect(client: any) {
    const stream_readable = new stream.Readable({
      read(){}
    });
    const transformedMessage= new TransformMessage();
    const writeMsg = new WriteMsg(client);
    
    console.warn("New user connected");
    client.send("Hello from websocket server");
    client.on("message", function (message: string) {
      stream_readable.push( message );
    });
    stream_readable.pipe(transformedMessage).pipe(writeMsg);
  
    client.on("close", function () {
      console.warn("Пользователь отключился");
    });
  }
  