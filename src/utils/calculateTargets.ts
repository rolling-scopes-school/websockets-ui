import { TShip, TTarget } from '../../types';

export const calculateTargets = (ships: TShip[]): TTarget[][] => {
  return ships.map((ship) => {
    const targets = new Array(ship.length).fill(ship.position);

    return targets.map((target, index) => {
      const { x, y } = target;
      return ship.direction
        ? { x, y: y + index, hit: false, direction: ship.direction }
        : { x: x + index, y, hit: false, direction: ship.direction };
    });
  });
};
