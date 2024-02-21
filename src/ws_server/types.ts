type ShipType = "huge" | "large" | "medium" | "small";

interface Position {
  x: number;
  y: number;
}

interface Ship {
  position: Position;
  direction: boolean;
  type: ShipType;
  length: number;
}

export interface AddShipsData {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}


export type AttackData = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number; 
};
