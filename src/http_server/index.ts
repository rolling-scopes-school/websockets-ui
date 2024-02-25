import * as fs from 'node:fs';
import * as path from 'node:path';
import * as http from 'node:http';
import { handleWsMessageEvent, wsServer } from 'ws_server';
import crypto from 'node:crypto';
import { WebSocket } from 'ws';
import { IClients } from '../../types';

const clients = {} as IClients;

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path =
    __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
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

wsServer.on('connection', (ws: WebSocket) => {
  // Generate a unique code for every user
  const userId = crypto.randomUUID();
  console.log(`Received a new connection.`);

  // Store the new connection
  clients[userId] = { ws, wins: 0, userName: '' };
  console.log(`Client ${userId} connected.`);

  // Handle messages from clients
  handleWsMessageEvent(ws, userId, clients);

  ws.on('error', console.error);

  ws.on('close', () => console.log(`Client ${userId} disconnected`));

  // ws.on('message', (message: IRegData) => {
  //   const parsedMessage = JSON.parse(message.toString());
  //   // const parsedData = JSON.parse(parsedMessage?.data?.toString());

  //   // console.log(`Received message: ${message}`);
  //   // console.log(`Received message: ${message.toString()}`);
  //   // console.log(`Received message: ${ JSON.parse(message.toString())}`);
  //   console.log(`Received data: ${message.type}`);
  //   console.log(`userId: ${userId}`);

  //   if (parsedMessage?.type === WS_COMMAND_TYPES.REG) {
  //     const parsedData = JSON.parse(parsedMessage?.data?.toString());
  //     userName = parsedData?.name;
  //     (clients[userId] as IClientData).userName = userName;

  //     ws.send(
  //       JSON.stringify({
  //         type: WS_COMMAND_TYPES.REG,
  //         data: JSON.stringify({
  //           name: parsedData?.name,
  //           index: userId,
  //           error: false,
  //           errorText: '',
  //         }),
  //         id: 0,
  //       }),
  //     );

  //     ws.send(
  //       JSON.stringify({
  //         type: WS_COMMAND_TYPES.UPDATE_WINNERS,
  //         data: JSON.stringify([]),
  //         id: 0,
  //       }),
  //     );

  //     ws.send(
  //       JSON.stringify({
  //         type: WS_COMMAND_TYPES.UPDATE_ROOM,
  //         data: JSON.stringify(rooms),
  //         id: 0,
  //       }),
  //     );
  //   }

  //   // TODO block possibility create more then 1 room for active session
  //   if (parsedMessage?.type === WS_COMMAND_TYPES.CREATE_ROOM) {
  //     const roomWithOneUser = rooms.find((room) => room.roomUsers.length === 1);
  //     if (roomWithOneUser) return;

  //     const newRoom = {
  //       roomId: crypto.randomUUID(),
  //       roomUsers: [
  //         {
  //           name: clients[userId]?.userName,
  //           index: userId,
  //         },
  //       ],
  //     } as unknown as IRoom;

  //     rooms.push(newRoom);

  //     [...wsServer.clients].forEach((client) => {
  //       client.send(
  //         JSON.stringify({
  //           type: WS_COMMAND_TYPES.UPDATE_ROOM,
  //           data: JSON.stringify(rooms),
  //           id: 0,
  //         }),
  //       );
  //     });
  //   }

  //   if (parsedMessage?.type === WS_COMMAND_TYPES.ADD_USER_TO_ROOM) {
  //     const parsedData = JSON.parse(parsedMessage?.data?.toString());

  //     // console.log('client', [...wsServer.clients].filter(client => client === ws));

  //     console.log('userId', userId);

  //     const roomWithOneUser = rooms.find(
  //       (room) =>
  //         room.roomId === parsedData?.indexRoom &&
  //         room.roomUsers.length &&
  //         room.roomUsers[0]?.index !== userId,
  //     );

  //     console.log('roomWithOneUser', roomWithOneUser);

  //     if (roomWithOneUser) {
  //       rooms = rooms.filter(
  //         (room) =>
  //           room.roomId !== parsedData?.indexRoom && room.roomUsers.length,
  //       );

  //       const rivalId = roomWithOneUser.roomUsers[0]?.index as string;
  //       const gameId = crypto.randomUUID();

  //       [...wsServer.clients].forEach((client) => {
  //         if (
  //           client === clients[userId]?.ws ||
  //           client === clients[rivalId]?.ws
  //         ) {
  //           client.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.CREATE_GAME,
  //               data: JSON.stringify({
  //                 idGame: gameId,
  //                 idPlayer: client === clients[userId]?.ws ? userId : rivalId,
  //               }),
  //               id: 0,
  //             }),
  //           );
  //         }
  //       });
  //     } else {
  //       // rooms = rooms.map((room) => {
  //       //   if (room.roomId === parsedData?.indexRoom && !room.roomUsers.length) {
  //       //     return {
  //       //       roomId: room.roomId,
  //       //       roomUsers: [
  //       //         {
  //       //           name: userName,
  //       //           index: userId,
  //       //         },
  //       //       ],
  //       //     };
  //       //   }
  //       //   return room;
  //       // });
  //     }

  //     ws.send(
  //       JSON.stringify({
  //         type: WS_COMMAND_TYPES.UPDATE_ROOM,
  //         data: JSON.stringify(rooms),
  //         id: 0,
  //       }),
  //     );
  //   }

  //   if (parsedMessage?.type === WS_COMMAND_TYPES.ADD_SHIPS) {
  //     const parsedData = JSON.parse(parsedMessage?.data?.toString());
  //     const { gameId, ships, indexPlayer } = parsedData;
  //     const targets = calculateTargets(ships);

  //     console.log(
  //       'parsedData add_ships',
  //       parsedData,
  //       gameId,
  //       ships,
  //       indexPlayer,
  //     );

  //     console.log(gameData[parsedData.gameId]);

  //     if (!gameData[gameId]) {
  //       gameData[gameId] = { player1: { ships: targets, indexPlayer } };
  //     } else {
  //       gameData[gameId].player2 = { ships: targets, indexPlayer };
  //     }

  //     if (gameData[gameId]?.player1 && gameData[gameId]?.player2) {
  //       const { player1, player2 } = gameData[gameId] as IPlayers;
  //       shooterId = player1.indexPlayer;

  //       [...wsServer.clients].forEach((client) => {
  //         if (
  //           client === clients[player1.indexPlayer]?.ws ||
  //           client === clients[player2.indexPlayer]?.ws
  //         ) {
  //           client.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.START_GAME,
  //               data: JSON.stringify(
  //                 client === clients[player1.indexPlayer]?.ws
  //                   ? {
  //                       ships: player1.ships,
  //                       currentPlayerIndex: player1.indexPlayer,
  //                     }
  //                   : {
  //                       ships: player2.ships,
  //                       currentPlayerIndex: player2.indexPlayer,
  //                     },
  //               ),
  //               id: 0,
  //             }),
  //           );

  //           client.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.TURN,
  //               data: JSON.stringify({
  //                 currentPlayer: shooterId,
  //               }),
  //               id: 0,
  //             }),
  //           );
  //         }
  //       });
  //     }

  //     console.log('gameData', gameData);
  //   }

  //   if (
  //     parsedMessage?.type === WS_COMMAND_TYPES.ATTACK ||
  //     parsedMessage?.type === WS_COMMAND_TYPES.RANDOM_ATTACK
  //   ) {
  //     const parsedData = JSON.parse(parsedMessage?.data?.toString());
  //     const {
  //       gameId,
  //       indexPlayer: shooterIndex,
  //       x: xCoordinate,
  //       y: yCoordinate,
  //     } = parsedData;

  //     const x =
  //       parsedMessage?.type === WS_COMMAND_TYPES.RANDOM_ATTACK
  //         ? Math.floor(Math.random() * 10)
  //         : xCoordinate;
  //     const y =
  //       parsedMessage?.type === WS_COMMAND_TYPES.RANDOM_ATTACK
  //         ? Math.floor(Math.random() * 10)
  //         : yCoordinate;

  //     // ignore out of turn attacks
  //     if (shooterId !== shooterIndex) return;

  //     const rivalData = Object.values(gameData[gameId] as IPlayers).find(
  //       ({ indexPlayer }) => indexPlayer !== shooterId,
  //     );

  //     const rivalShips = rivalData?.ships as TTarget[][];
  //     let isHit = false;
  //     let isKilled = false;
  //     let killedShip: TTarget[];

  //     rivalData.ships = rivalShips.map((targets) => {
  //       const checkedTargets = targets.map((target) => {
  //         if (target.x === x && target.y === y) {
  //           isHit = true;
  //           return { ...target, hit: true };
  //         } else {
  //           return target;
  //         }
  //       });
  //       const isShipKilled =
  //         checkedTargets.every((target) => target.hit) &&
  //         Boolean(
  //           checkedTargets.find((target) => target.x === x && target.y === y),
  //         );

  //       console.log(
  //         'isShipKilled',
  //         isShipKilled,
  //         checkedTargets.find((target) => target.x === x && target.y === y),
  //       );

  //       if (isShipKilled) {
  //         isKilled = true;
  //         killedShip = checkedTargets;
  //       }

  //       console.log(isKilled, checkedTargets);
  //       return checkedTargets;
  //     });

  //     console.log(rivalData.ships);
  //     console.log('shooterId:', shooterId);

  //     if (!isHit) {
  //       console.log('change shooter');
  //       shooterId = rivalData.indexPlayer;
  //     }

  //     const { player1, player2 } = gameData[gameId] as IPlayers;

  //     Object.entries(clients)
  //       .filter(
  //         ([clientId]) =>
  //           clientId === player1.indexPlayer ||
  //           clientId === player2.indexPlayer,
  //       )
  //       .forEach(([clientId, client]) => {
  //         client.ws.send(
  //           JSON.stringify({
  //             type: WS_COMMAND_TYPES.ATTACK,
  //             data: JSON.stringify({
  //               position: { x, y },
  //               currentPlayer: shooterIndex,
  //               status: isKilled
  //                 ? ATTACK_STATUSES.KILLED
  //                 : isHit
  //                   ? ATTACK_STATUSES.SHOT
  //                   : ATTACK_STATUSES.MISS,
  //             }),
  //             id: 0,
  //           }),
  //         );

  //         if (isKilled) {
  //           const coordinates = findCoordinatesAroundKilledShip(killedShip);
  //           console.log('missed coordinates: ', coordinates);

  //           killedShip.forEach((targets) => {
  //             if (!(targets.x === x && targets.y === y)) {
  //               client.ws.send(
  //                 JSON.stringify({
  //                   type: WS_COMMAND_TYPES.ATTACK,
  //                   data: JSON.stringify({
  //                     position: { x: targets.x, y: targets.y },
  //                     currentPlayer: shooterIndex,
  //                     status: ATTACK_STATUSES.KILLED,
  //                   }),
  //                   id: 0,
  //                 }),
  //               );
  //             }
  //           });

  //           coordinates.forEach((coordinate) => {
  //             client.ws.send(
  //               JSON.stringify({
  //                 type: WS_COMMAND_TYPES.ATTACK,
  //                 data: JSON.stringify({
  //                   position: { x: coordinate.x, y: coordinate.y },
  //                   currentPlayer: shooterIndex,
  //                   status: ATTACK_STATUSES.MISS,
  //                 }),
  //                 id: 0,
  //               }),
  //             );
  //           });
  //         }

  //         const isAllShipsKilled = (rivalData.ships as TTarget[][]).every(
  //           (targets) => targets.every((target) => target.hit),
  //         );

  //         console.log('isAllShipsKilled', isAllShipsKilled);

  //         if (isKilled && isAllShipsKilled) {
  //           if (clientId === shooterId) {
  //             client.wins += 1;
  //           }

  //           gameData[gameId] = {};

  //           client.ws.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.FINISH,
  //               data: JSON.stringify({
  //                 winPlayer: shooterId,
  //               }),
  //               id: 0,
  //             }),
  //           );

  //           client.ws.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.UPDATE_WINNERS,
  //               data: JSON.stringify({
  //                 name: client.userName,
  //                 wins: client.wins,
  //               }),
  //               id: 0,
  //             }),
  //           );

  //           client.ws.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.UPDATE_ROOM,
  //               data: JSON.stringify(rooms),
  //               id: 0,
  //             }),
  //           );
  //         } else {
  //           client.ws.send(
  //             JSON.stringify({
  //               type: WS_COMMAND_TYPES.TURN,
  //               data: JSON.stringify({
  //                 currentPlayer: shooterId,
  //               }),
  //               id: 0,
  //             }),
  //           );
  //         }
  //       });
  //   }
  // });
});
