// import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
// import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


// Type "Hello World".
console.log(robot.typeString("Hello World"))

// Press enter.
console.log(robot.keyTap("enter"))

console.log('blah',blah)