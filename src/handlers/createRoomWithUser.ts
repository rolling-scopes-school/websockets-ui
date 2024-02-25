import crypto from 'node:crypto';
import { wsServer } from 'ws_server';
import { IRoom } from '../../types';
import { WS_COMMAND_TYPES } from '../../constants';
import handleWsSendEvent from './handleWsSendEvent';

const createRoomWithUser = (
  rooms: IRoom[],
  userName: string,
  userId: string,
) => {
  const newRoomWithUser = {
    roomId: crypto.randomUUID(),
    roomUsers: [
      {
        name: userName,
        index: userId,
      },
    ],
  } as unknown as IRoom;

  rooms.push(newRoomWithUser);

  [...wsServer.clients].forEach((client) => {
    handleWsSendEvent(client, WS_COMMAND_TYPES.UPDATE_ROOM, rooms);
  });
};

export default createRoomWithUser;
