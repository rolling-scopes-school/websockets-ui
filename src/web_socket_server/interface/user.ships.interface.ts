import { ShipsTypes } from '../enum/ships.types';
import { DeckStatus } from '../enum/deck.status';

export interface IPositionInterface {
    x: number;
    y: number;
}

interface IShipsInterface {
    direction: boolean;
    length: number;
    type: ShipsTypes;
}

export interface IShipsShortInterface extends IShipsInterface {
    position: IPositionInterface;
}

export interface IUserShipsInterface {
    gameId: number;
    ships: IShipsShortInterface[];
    indexPlayer: number;
}

interface IPositionWithStatus extends IPositionInterface {
    status: DeckStatus;
}

export interface IShipsFullInterface extends IShipsInterface {
    position: IPositionWithStatus[];
}

export interface IUserFullShipsInterface {
    gameId: number;
    ships: IShipsFullInterface[];
    indexPlayer: number;
}
