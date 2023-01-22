import { RADIAN_PER_DEGREE } from './const';

export const getCirclePointCoords = (
  x0: number,
  y0: number,
  radius: number,
  angle: number
): [number, number] => {
  return [
    x0 + radius * Math.cos(angle * RADIAN_PER_DEGREE),
    y0 + radius * Math.sin(angle * RADIAN_PER_DEGREE)
  ];
};
