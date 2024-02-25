import { IPositionInterface } from './user.ships.interface';

export interface BotHitsInterface {
    botHits: IPositionInterface[];
    aroundHits: IPositionInterface[];
    gameId: number;
    firstHit: IPositionInterface[];
}
