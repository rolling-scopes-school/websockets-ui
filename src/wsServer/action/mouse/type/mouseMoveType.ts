import { Point } from '@nut-tree/nut-js';

type MouseMoveType = (px: number) => Promise<Point[]>;

export default MouseMoveType;
