import { ShipsTypes } from '../enum/ships.types';

export interface IPositionInterface {
    x: number;
    y: number;
}

export type IFullPositionInterface = IPositionInterface | IPositionInterface[];


interface IShipsInterface {
    position: IFullPositionInterface;
    direction: boolean;
    length: number;
    type: ShipsTypes;
}

export interface IUserShipsInterface {
    gameId: number;
    ships: IShipsInterface[];
    indexPlayer: number;
}

