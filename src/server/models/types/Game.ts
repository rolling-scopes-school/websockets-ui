import { GridCell } from '../enums/GridCell.enum';
import { ServerAttackData } from './ServerData';

export type GridCellData = Omit<ServerAttackData, 'currentPlayer'>;

export type GameGrid = GridCell[][];
