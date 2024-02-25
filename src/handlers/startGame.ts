import { wsServer } from 'ws_server';
import { IClients, IGame, IPlayers } from '../../types';
import { WS_COMMAND_TYPES } from '../../constants';
import handleWsSendEvent from './handleWsSendEvent';

const startGame = (
  gameData: IGame,
  gameId: string,
  shooterId: string,
  clients: IClients,
) => {
  if (gameData[gameId]?.player1 && gameData[gameId]?.player2) {
    const { player1, player2 } = gameData[gameId] as IPlayers;

    shooterId = player1.indexPlayer;

    [...wsServer.clients].forEach((client) => {
      if (
        client === clients[player1.indexPlayer]?.ws ||
        client === clients[player2.indexPlayer]?.ws
      ) {
        const data =
          client === clients[player1.indexPlayer]?.ws
            ? {
                ships: player1.ships,
                currentPlayerIndex: player1.indexPlayer,
              }
            : {
                ships: player2.ships,
                currentPlayerIndex: player2.indexPlayer,
              };

        handleWsSendEvent(client, WS_COMMAND_TYPES.START_GAME, data);
        handleWsSendEvent(client, WS_COMMAND_TYPES.TURN, {
          currentPlayer: shooterId,
        });
      }
    });
  }

  return shooterId;
};

export default startGame;
