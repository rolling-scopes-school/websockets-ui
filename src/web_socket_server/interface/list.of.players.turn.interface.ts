import { IPositionInterface } from './user.ships.interface';

export interface IPlayerInterface {
    indexPlayer: number;
    playerTurns: IPositionInterface[];
}

export interface ListOfPlayersTurnInterface {
    gameId: number;
    indexPlayer: number;
    [key: string]: IPlayerInterface | number;
}
