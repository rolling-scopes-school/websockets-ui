import robot from 'robotjs';
import { WebSocket } from 'ws';
import { createClietCommand } from '../utils';

const sendCoords = (socket: WebSocket, msg: string) => {
  return socket.send(createClietCommand(msg));
};

export default sendCoords;
