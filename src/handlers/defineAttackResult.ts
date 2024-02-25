import { IPlayer, IPlayers, TTarget } from '../../types';

const defineAttackResult = (
  players: IPlayers,
  shooterId: string,
  shotCoordinates: {
    x: number;
    y: number;
  },
) => {
  const { x, y } = shotCoordinates;
  const rivalData = Object.values(players as IPlayers).find(
    ({ indexPlayer }) => indexPlayer !== shooterId,
  ) as IPlayer;

  const rivalShips = rivalData?.ships as TTarget[][];
  let isHit = false;
  let isKilled = false;
  let killedShip: TTarget[] = [];

  rivalData.ships = rivalShips.map((targets) => {
    const checkedTargets = targets.map((target) => {
      if (target.x === x && target.y === y) {
        isHit = true;
        return { ...target, hit: true };
      } else {
        return target;
      }
    });
    const isShipKilled =
      checkedTargets.every((target) => target.hit) &&
      Boolean(
        checkedTargets.find((target) => target.x === x && target.y === y),
      );

    if (isShipKilled) {
      isKilled = true;
      killedShip = checkedTargets;
    }

    return checkedTargets;
  });

  if (!isHit) {
    shooterId = rivalData.indexPlayer;
  }

  return {
    isHit,
    isKilled,
    killedShip,
    rivalData,
    updatedShooterId: shooterId,
  };
};

export default defineAttackResult;
