import { WebSocketServer, WebSocket } from 'ws';
import crypto from 'node:crypto';
import {
  IClientData,
  IClients,
  IGame,
  IPlayers,
  IRegData,
  IRoom,
} from '../../types';
import { WS_COMMAND_TYPES } from '../../constants';
import {
  createBotConnection,
  createGame,
  createRoomWithUser,
  defineGameData,
  handleAttack,
  handleWsSendEvent,
  startGame,
} from 'handlers';
import sendBotRandomAttack from 'utils/sendBotRandomAttack';

let rooms: IRoom[] = [];
let userName: string = '';
let gameData = {} as IGame;
let shooterId = '';
let gameWithBot = false;
let botWebsocket = {} as WebSocket;

export const wsServer = new WebSocketServer({ port: 3000 });

export const handleWsMessageEvent = (
  ws: WebSocket,
  userId: string,
  clients: IClients,
) => {
  ws.on('message', (message: IRegData) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage?.type === WS_COMMAND_TYPES.REG) {
      const parsedData = JSON.parse(parsedMessage?.data?.toString());
      userName = parsedData?.name;
      (clients[userId] as IClientData).userName = userName;

      const data = {
        name: parsedData?.name,
        index: userId,
        error: false,
        errorText: '',
      };

      handleWsSendEvent(ws, WS_COMMAND_TYPES.REG, data);
      handleWsSendEvent(ws, WS_COMMAND_TYPES.UPDATE_WINNERS, []);
      handleWsSendEvent(ws, WS_COMMAND_TYPES.UPDATE_ROOM, rooms);
    }

    if (parsedMessage?.type === WS_COMMAND_TYPES.CREATE_ROOM) {
      const roomWithOneUser = rooms.find((room) => room.roomUsers.length === 1);

      // block possibility create more then 1 room for active session
      if (roomWithOneUser) return;

      const userName = clients[userId]?.userName as string;

      createRoomWithUser(rooms, userName, userId);
    }

    if (parsedMessage?.type === WS_COMMAND_TYPES.SINGLE_PLAY) {
      botWebsocket = createBotConnection();

      const gameId = crypto.randomUUID();
      gameWithBot = true;

      const gameDataResponse = {
        idGame: gameId,
        idPlayer: userId,
      };

      handleWsSendEvent(ws, WS_COMMAND_TYPES.CREATE_GAME, gameDataResponse);
    }

    if (parsedMessage?.type === WS_COMMAND_TYPES.ADD_USER_TO_ROOM) {
      const parsedData = JSON.parse(parsedMessage?.data?.toString());

      rooms = createGame(rooms, parsedData, userId, clients);
    }

    if (parsedMessage?.type === WS_COMMAND_TYPES.ADD_SHIPS) {
      const parsedData = JSON.parse(parsedMessage?.data?.toString());

      defineGameData(parsedData, gameData, gameWithBot);

      shooterId = startGame(gameData, parsedData.gameId, shooterId, clients);
    }

    if (
      parsedMessage?.type === WS_COMMAND_TYPES.ATTACK ||
      parsedMessage?.type === WS_COMMAND_TYPES.RANDOM_ATTACK
    ) {
      const parsedData = JSON.parse(parsedMessage?.data?.toString());

      // ignore out of turn attacks
      if (shooterId !== parsedData.indexPlayer) return;

      const { updatedGameData, updatedShooterId } = handleAttack(
        clients,
        gameData,
        parsedMessage,
        shooterId,
        rooms,
      );

      const isGameFinished = !Object.keys(
        updatedGameData[parsedData?.gameId] as IPlayers,
      ).length;

      if (isGameFinished && botWebsocket.readyState === WebSocket.OPEN) {
        botWebsocket.close();
      }

      sendBotRandomAttack(
        updatedShooterId,
        parsedData?.gameId,
        isGameFinished,
        botWebsocket,
      );

      gameData = updatedGameData;
      shooterId = updatedShooterId;
    }
  });
};
