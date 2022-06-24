export type Coordinates = {
  x: number; 
  y: number;
}

export type DrawRectangleType = {
  coordinates: Coordinates;
  bias: {
    x: number,
    y?: number,
  }; 
}