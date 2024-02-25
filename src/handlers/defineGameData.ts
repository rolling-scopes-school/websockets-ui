import { calculateTargets } from 'utils/calculateTargets';
import { IGame, IPlayers, TTarget } from '../../types';
import { BOT_ID, BOT_SHIPS_PLACEMENT_VARIANTS } from '../../constants';

const defineGameData = (
  parsedData: any,
  gameData: IGame,
  gameWithBot: boolean,
) => {
  const { gameId, ships, indexPlayer } = parsedData;
  const targets = calculateTargets(ships);

  if (!gameData[gameId]) {
    gameData[gameId] = { player1: { ships: targets, indexPlayer } } as IPlayers;

    if (gameWithBot) {
      const botShips = BOT_SHIPS_PLACEMENT_VARIANTS[
        Math.floor(Math.random() * 5)
      ] as TTarget[][];

      (gameData[gameId] as IPlayers).player2 = { ships: botShips, indexPlayer: BOT_ID };
    }
  } else {
    (gameData[gameId] as IPlayers).player2 = { ships: targets, indexPlayer };
  }
};

export default defineGameData;
