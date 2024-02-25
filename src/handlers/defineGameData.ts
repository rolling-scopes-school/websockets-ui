import { calculateTargets } from 'utils/calculateTargets';
import { IGame, IPlayers } from '../../types';

const defineGameData = (parsedData: any, gameData: IGame) => {
  const { gameId, ships, indexPlayer } = parsedData;
  const targets = calculateTargets(ships);

  if (!gameData[gameId]) {
    gameData[gameId] = { player1: { ships: targets, indexPlayer } } as IPlayers;
  } else {
    (gameData[gameId] as IPlayers).player2 = { ships: targets, indexPlayer };
  }
};

export default defineGameData;
