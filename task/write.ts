import { Writable } from "stream";
import WebSocket from "ws";
export interface WriteMsg {
  wsClient: WebSocket.WebSocket;
}

export class WriteMsg extends Writable {
  constructor(wsClient: any) {
    super();
    this.wsClient = wsClient;
  }

  _write(chunk:any,encoding: any,callback: () => void) {    
    this.wsClient.send(chunk.toString())
    callback();
  }

}
