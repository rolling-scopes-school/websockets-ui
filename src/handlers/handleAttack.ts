import { IClients, IGame, IPlayers, IRoom, TTarget } from '../../types';
import { ATTACK_STATUSES, WS_COMMAND_TYPES } from '../../constants';
import defineCoordinates from 'utils/defineCoordinates';
import defineAttackResult from './defineAttackResult';
import { findCoordinatesAroundKilledShip } from 'utils/findCoordinatesAroundKilledShip';
import handleWsSendEvent from './handleWsSendEvent';

const handleAttack = (
  clients: IClients,
  gameData: IGame,
  parsedMessage: any,
  shooterId: string,
  rooms: IRoom[],
): {
  updatedGameData: IGame;
  updatedShooterId: string;
} => {
  const parsedData = JSON.parse(parsedMessage?.data?.toString());

  const { gameId, indexPlayer: shooterIndex } = parsedData;

  const shotCoordinates = defineCoordinates(parsedMessage);
  const { isHit, isKilled, killedShip, rivalData, updatedShooterId } =
    defineAttackResult(
      gameData[gameId] as IPlayers,
      shooterId,
      shotCoordinates,
    );

  shooterId = updatedShooterId;

  const { player1, player2 } = gameData[gameId] as IPlayers;
  const { x, y } = shotCoordinates;

  Object.entries(clients)
    .filter(
      ([clientId]) =>
        clientId === player1.indexPlayer || clientId === player2.indexPlayer,
    )
    .forEach(([clientId, client]) => {
      const attackResultData = {
        position: { x, y },
        currentPlayer: shooterIndex,
        status: isKilled
          ? ATTACK_STATUSES.KILLED
          : isHit
            ? ATTACK_STATUSES.SHOT
            : ATTACK_STATUSES.MISS,
      };

      handleWsSendEvent(client.ws, WS_COMMAND_TYPES.ATTACK, attackResultData);

      if (isKilled) {
        killedShip.forEach((targets) => {
          if (!(targets.x === x && targets.y === y)) {
            const killedAttackResultData = {
              position: { x: targets.x, y: targets.y },
              currentPlayer: shooterIndex,
              status: ATTACK_STATUSES.KILLED,
            };

            handleWsSendEvent(
              client.ws,
              WS_COMMAND_TYPES.ATTACK,
              killedAttackResultData,
            );
          }
        });

        const coordinatesAroundKilledShip =
          findCoordinatesAroundKilledShip(killedShip);

        coordinatesAroundKilledShip.forEach((coordinate) => {
          const missedAttackResultData = {
            position: { x: coordinate.x, y: coordinate.y },
            currentPlayer: shooterIndex,
            status: ATTACK_STATUSES.MISS,
          };

          handleWsSendEvent(
            client.ws,
            WS_COMMAND_TYPES.ATTACK,
            missedAttackResultData,
          );
        });
      }

      const allShipsKilled = (rivalData.ships as TTarget[][]).every((targets) =>
        targets.every((target) => target.hit),
      );

      if (isKilled && allShipsKilled) {
        if (clientId === shooterId) {
          client.wins += 1;
        }

        gameData[gameId] = {} as IPlayers;

        const finishGameData = {
          winPlayer: shooterId,
        };

        const winnerData = {
          name: client.userName,
          wins: client.wins,
        };

        handleWsSendEvent(client.ws, WS_COMMAND_TYPES.FINISH, finishGameData);
        handleWsSendEvent(
          client.ws,
          WS_COMMAND_TYPES.UPDATE_WINNERS,
          winnerData,
        );
        handleWsSendEvent(client.ws, WS_COMMAND_TYPES.UPDATE_ROOM, rooms);
      } else {
        const turnData = {
          currentPlayer: shooterId,
        };

        handleWsSendEvent(client.ws, WS_COMMAND_TYPES.TURN, turnData);
      }
    });

  return { updatedGameData: gameData, updatedShooterId: shooterId };
};

export default handleAttack;
