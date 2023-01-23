import { httpServer } from "./src/http_server/index";
import {socketConnection} from "./src/http_server/controller"

const HTTP_PORT = 8181;
const ip = "127.0.0.1";

export class SocketServer {
  constructor(private port: number) {
      httpServer.listen(this.port, ip);
      console.log('server start on port: ', this.port);
      console.log(`Start static http server on the ${this.port} port!`);
  }
}

new SocketServer(HTTP_PORT);

socketConnection();