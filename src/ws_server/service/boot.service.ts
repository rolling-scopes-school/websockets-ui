export function newBoard() {
  const dim: number = 10;
  const board: number[][] = Array.from({ length: dim }, () =>
    Array(dim).fill(0)
  );

  const shipLengths: number[] = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

  for (const shipLength of shipLengths) {
    let isShipPlaced: boolean = false;

    while (!isShipPlaced) {
      const head: [number, number] = [
        Math.floor(Math.random() * dim),
        Math.floor(Math.random() * dim),
      ];
      const heading: number = Math.floor(Math.random() * 4);

      let tail: [number, number];
      switch (heading) {
        case 0:
          tail = [head[0] - shipLength + 1, head[1]];
          break;
        case 1:
          tail = [head[0] + shipLength - 1, head[1]];
          break;
        case 2:
          tail = [head[0], head[1] + shipLength - 1];
          break;
        case 3:
          tail = [head[0], head[1] - shipLength + 1];
          break;
        default:
          tail = [head[0], head[1]];
      }

      if (
        !(
          0 <= tail[0] &&
          tail[0] <= dim - 1 &&
          0 <= tail[1] &&
          tail[1] <= dim - 1
        )
      ) {
        continue;
      }

      const NSMin: number = Math.min(head[0], tail[0]);
      const NSMax: number = Math.max(head[0], tail[0]);
      const EWMin: number = Math.min(head[1], tail[1]);
      const EWMax: number = Math.max(head[1], tail[1]);

      // Check if ship touches another ship horizontally or vertically
      let touchesShip: boolean = false;
      for (let i: number = NSMin - 1; i <= NSMax + 1; i++) {
        for (let j: number = EWMin - 1; j <= EWMax + 1; j++) {
          if (i >= 0 && i < dim && j >= 0 && j < dim && board[i][j] === 1) {
            touchesShip = true;
            break;
          }
        }
        if (touchesShip) break;
      }

      if (touchesShip) continue;

      // Place the ship
      for (let i: number = NSMin; i <= NSMax; i++) {
        for (let j: number = EWMin; j <= EWMax; j++) {
          board[i][j] = 1;
        }
      }

      isShipPlaced = true;
    }
  }

  return board;
}
