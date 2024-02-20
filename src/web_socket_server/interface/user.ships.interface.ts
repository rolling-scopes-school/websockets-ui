import { ShipsTypes } from '../enum/ships.types';

interface IPositionInterface {
    x: number;
    y: number;
}

interface IShipsInterface {
    position: IPositionInterface;
    direction: boolean;
    length: number;
    type: ShipsTypes;
}

export interface IUserShipsInterface {
    gameId: number;
    ships: IShipsInterface[];
    indexPlayer: number;
}
