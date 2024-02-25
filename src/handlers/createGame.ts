import crypto from 'node:crypto';
import { wsServer } from 'ws_server';
import { IClients, IRoom } from '../../types';
import { WS_COMMAND_TYPES } from '../../constants';
import handleWsSendEvent from './handleWsSendEvent';

const createGame = (
  rooms: IRoom[],
  data: any,
  userId: string,
  clients: IClients,
): IRoom[] => {
  const roomWithOneUser = rooms.find(
    (room) =>
      room.roomId === data?.indexRoom &&
      room.roomUsers.length &&
      room.roomUsers[0]?.index !== userId,
  );

  if (roomWithOneUser) {
    rooms = rooms.filter(
      (room) => room.roomId !== data?.indexRoom && room.roomUsers.length,
    );

    const rivalId = roomWithOneUser.roomUsers[0]?.index as string;
    const gameId = crypto.randomUUID();

    [...wsServer.clients].forEach((client) => {
      if (client === clients[userId]?.ws || client === clients[rivalId]?.ws) {
        const gameDataResponse = {
          idGame: gameId,
          idPlayer: client === clients[userId]?.ws ? userId : rivalId,
        };

        handleWsSendEvent(
          client,
          WS_COMMAND_TYPES.CREATE_GAME,
          gameDataResponse,
        );

        handleWsSendEvent(client, WS_COMMAND_TYPES.UPDATE_ROOM, rooms);
      }
    });
  }

  return rooms;
};

export default createGame;
