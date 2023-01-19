import { Point } from '@nut-tree/nut-js';

type MouseMoveDtoResponseType = { step: number };

type MouseMoveType = (px: number) => Promise<Point[]>;

export { MouseMoveDtoResponseType, MouseMoveType };
