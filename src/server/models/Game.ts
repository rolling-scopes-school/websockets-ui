import {
  ClientAttackData,
  Coordinates,
  Ship,
} from '../models/types/ClientData';
import { GameRoom } from './types/Room'
import { AttackStatusEnum } from './enums/AttackStatus.enum';
import { GridCell } from './enums/GridCell.enum';
import { setCellValue } from '../utils/utils';
import { Direction } from './enums/Direction.enum';
import { GamePlayer } from './types/Player';
import { GameGrid, GridCellData } from './types/Game';

interface CellNeighbors {
  direction: Direction;
  value: GridCell | undefined;
}

export class Game {
  id: number;
  players: GamePlayer[] = [];
  currentPlayerIndex: number | null;
  private GRID_SIZE = 10;
  private SHIPS_COUNT = 10;

  constructor(room: GameRoom, index: number) {
    this.id = index;
    this.players = [...room.players];
    this.currentPlayerIndex = null;
  }

  public setGameShips(ships: Ship[], playerIndex: number): void {
    const player = this.players.find((v) => v.index === playerIndex);

    if (player) {
      player.ships = [...ships];
      player.grid = this.fillGrid(player.ships);
    }
  }

  public isReady(): boolean {
    return this.players.every((v) => v.ships !== null);
  }

  public checkAttack(data: ClientAttackData): GridCellData[] | null {
    const opponent = this.getOpponent(data.indexPlayer);

    if (opponent && opponent.grid) {
      const targetPosition: Coordinates = { x: data.x, y: data.y };
      const targetCell = this.getTargetCell(opponent.grid, targetPosition);

      switch (targetCell) {
        case GridCell.Shot:
        case GridCell.Miss:
          return null;
        case GridCell.Empty:
          this.setNextPlayerIndex(data.indexPlayer);
          return this.failureAttackResult(opponent.grid, targetPosition);
        case GridCell.Ship:
          return this.successAttackResult(
            opponent.grid,
            targetPosition,
            opponent,
          );
      }
    }
    return null;
  }

  private createGrid<T>(filler: T, size = this.GRID_SIZE): T[][] {
    return Array.from(new Array(size), () =>
      Array.from(new Array(size), () => filler),
    );
  }

  private fillGrid(data: Ship[]) {
    const grid = this.createGrid<GridCell>(GridCell.Empty);

    for (let i = 0; i < data.length; i++) {
      const ship = data[i];

      if (ship) {
        setCellValue(grid, ship.position.y, ship.position.x, GridCell.Ship);

        for (let j = 1; j < ship.length; j++) {
          if (ship.direction) {
            //down
            setCellValue(
              grid,
              ship.position.y + j,
              ship.position.x,
              GridCell.Ship,
            );
          } else {
            // right
            setCellValue(
              grid,
              ship.position.y,
              ship.position.x + j,
              GridCell.Ship,
            );
          }
        }
      }
    }

    return grid;
  }

  private isKilled(
    grid: GameGrid,
    target: {
      x: number;
      y: number;
    },
  ): boolean {
    const checkData = this.getNeighbors(grid, target).filter(
      (v) => v.value !== undefined,
    );
    return checkData.every((v) => v.value !== GridCell.Ship);
  }

  private getResults(grid: GameGrid, target: Coordinates) {
    const neighbors: CellNeighbors[] = this.getNeighbors(grid, target);

    const direction: boolean = neighbors
      .filter((v) => v.value === GridCell.Shot)
      .some(
        (v) => v.direction === Direction.Up || v.direction === Direction.Down,
      );

    let data: GridCell[];

    if (direction) {
      // full column
      data = this.getGridColumn(grid, target.x);
    } else {
      //full row
      data = this.getGridRow(grid, target.y);
    }

    let res: GridCellData[] = [];

    // ship cells
    for (let i = 0; i < data.length; i++) {
      if (data[i] === GridCell.Shot) {
        const shipCell: GridCellData = {
          position: direction ? { x: target.x, y: i } : { x: i, y: target.y }, // column : row
          status: AttackStatusEnum.Killed,
        };

        res.push(shipCell);

        const shipNeighbors: GridCellData[] = this.getNeighbors(
          grid,
          shipCell.position,
        )
          .filter(
            (v) => v.value === GridCell.Empty || v.value === GridCell.Miss,
          )
          .map((v) => {
            let position: Coordinates;
            switch (v.direction) {
              case Direction.Left:
                position = {
                  x: shipCell.position.x - 1,
                  y: shipCell.position.y,
                };
                break;
              case Direction.Right:
                position = {
                  x: shipCell.position.x + 1,
                  y: shipCell.position.y,
                };
                break;
              case Direction.Up:
                position = {
                  x: shipCell.position.x,
                  y: shipCell.position.y - 1,
                };
                break;
              case Direction.Down:
                position = {
                  x: shipCell.position.x,
                  y: shipCell.position.y + 1,
                };
                break;
              case Direction.UpLeft:
                position = {
                  x: shipCell.position.x - 1,
                  y: shipCell.position.y - 1,
                };
                break;
              case Direction.UpRight:
                position = {
                  x: shipCell.position.x + 1,
                  y: shipCell.position.y - 1,
                };
                break;
              case Direction.DownLeft:
                position = {
                  x: shipCell.position.x - 1,
                  y: shipCell.position.y + 1,
                };
                break;
              case Direction.DownRight:
                position = {
                  x: shipCell.position.x + 1,
                  y: shipCell.position.y + 1,
                };
                break;
            }
            const emptyCell: GridCellData = {
              position: { ...position },
              status: AttackStatusEnum.Miss,
            };
            return emptyCell;
          });

        res = [...res, ...shipNeighbors];
      }
    }

    const set: GridCellData[] = [
      ...new Set(res.map((v) => JSON.stringify(v))),
    ].map((v) => JSON.parse(v));

    console.log(set);
    return set;
  }

  private getNeighbors(grid: GameGrid, target: Coordinates): CellNeighbors[] {
    return [
      {
        direction: Direction.Up,
        value: grid[target.y - 1] ? grid[target.y - 1]![target.x] : undefined,
      },
      {
        direction: Direction.Down,
        value: grid[target.y + 1] ? grid[target.y + 1]![target.x] : undefined,
      },
      {
        direction: Direction.Left,
        value: grid[target.y]![target.x - 1],
      },
      {
        direction: Direction.Right,
        value: grid[target.y]![target.x + 1],
      },
      {
        direction: Direction.UpLeft,
        value: grid[target.y - 1]
          ? grid[target.y - 1]![target.x - 1]
          : undefined,
      },
      {
        direction: Direction.UpRight,
        value: grid[target.y - 1]
          ? grid[target.y - 1]![target.x + 1]
          : undefined,
      },
      {
        direction: Direction.DownLeft,
        value: grid[target.y + 1]
          ? grid[target.y + 1]![target.x - 1]
          : undefined,
      },
      {
        direction: Direction.DownRight,
        value: grid[target.y + 1]
          ? grid[target.y + 1]![target.x + 1]
          : undefined,
      },
    ];
  }

  private getGridColumn(grid: GameGrid, columnIndex: number): GridCell[] {
    return grid.map((row) => row[columnIndex]!);
  }

  private getGridRow(grid: GameGrid, rowIndex: number): GridCell[] {
    return grid[rowIndex]!;
  }

  private getUpCell(grid: GameGrid, target: Coordinates): GridCell | undefined {
    return grid[target.y - 1] ? grid[target.y - 1]![target.x] : undefined;
  }

  private getDownCell(
    grid: GameGrid,
    target: Coordinates,
  ): GridCell | undefined {
    return grid[target.y + 1] ? grid[target.y + 1]![target.x] : undefined;
  }

  private getLeftCell(
    grid: GameGrid,
    target: Coordinates,
  ): GridCell | undefined {
    return grid[target.y]![target.x - 1];
  }

  private getRightCell(
    grid: GameGrid,
    target: Coordinates,
  ): GridCell | undefined {
    return grid[target.y]![target.x + 1];
  }

  public setNextPlayerIndex(playerIndex: number): void {
    const nextPlayerIndex = this.getOpponent(playerIndex)?.index;
    if (nextPlayerIndex !== undefined) {
      this.currentPlayerIndex = nextPlayerIndex;
    }
  }

  public getWinnerIndex(): number | null {
    const loser = this.players.find((pl) => pl.points === this.SHIPS_COUNT);
    if (loser) {
      return this.players.find((pl) => pl.index !== loser.index)!.index!;
    } else {
      return null;
    }
  }

  setBotIndex(index: number): void {
    const bot = this.players.find(
      (pl) => pl.index === undefined && pl.ws === undefined,
    );
    if (bot) {
      bot.index = index;
    }
  }

  private getOpponent(playerIndex: number): GamePlayer | undefined {
    return this.players.find((pl) => pl.index !== playerIndex);
  }

  private getTargetCell(
    grid: GameGrid,
    position: Coordinates,
  ): GridCell | undefined {
    const row = grid[position.y];
    if (row) {
      return row[position.x];
    }
  }

  private multipleSetCellValue(grid: GameGrid, attackResults: GridCellData[]) {
    attackResults.forEach((res) => {
      setCellValue(
        grid,
        res.position.y,
        res.position.x,
        res.status === AttackStatusEnum.Killed ? GridCell.Shot : GridCell.Miss,
      );
    });
  }

  private incrementPlayerPoints(player: GamePlayer): void {
    player.points += 1;
  }

  private failureAttackResult(
    grid: GameGrid,
    position: Coordinates,
  ): GridCellData[] {
    setCellValue(grid, position.y, position.x, GridCell.Miss);

    return [
      {
        status: AttackStatusEnum.Miss,
        position: position,
      },
    ];
  }

  successAttackResult(
    grid: GameGrid,
    position: Coordinates,
    opponent: GamePlayer,
  ): GridCellData[] {
    setCellValue(grid, position.y, position.x, GridCell.Shot);

    if (this.isKilled(grid, position)) {
      this.incrementPlayerPoints(opponent);
      const attackResults: GridCellData[] = this.getResults(grid, position);
      this.multipleSetCellValue(grid, attackResults);
      return attackResults;
    }
    return [
      {
        status: AttackStatusEnum.Shot,
        position: position,
      },
    ];
  }
}
