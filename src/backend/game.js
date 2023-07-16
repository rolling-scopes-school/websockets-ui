export const isHit = (user, x, y) => {
  return user.hits.some((hit) => hit.x === x && hit.y === y);
};

export const isShot = (user, x, y) => {
  const ship = user.ships.find((ship) => {
    for (let i = 0; i < ship.length; i++) {
      if (ship.direction) {
        if (ship.position.x === x && ship.position.y + i === y) {
          return true;
        }
      } else {
        if (ship.position.x + i === x && ship.position.y === y) {
          return true;
        }
      }
    }
    return false;
  });

  if (!ship) return false;

  return ship;
};

export const isShipKilled = (user, ship) => {
  for (let i = 0; i < ship.length; i++) {
    if (ship.direction) {
      if (!isHit(user, ship.position.x, ship.position.y + i)) {
        return false;
      }
    } else {
      if (!isHit(user, ship.position.x + i, ship.position.y)) {
        return false;
      }
    }
  }
  return true;
};

export const getHitsAround = (x, y, hits) => {
  if (x > 0) {
    hits.push({ x: x - 1, y });
  }
  if (x < 9) {
    hits.push({ x: x + 1, y });
  }
  if (y > 0) {
    hits.push({ x, y: y - 1 });
  }
  if (y < 9) {
    hits.push({ x, y: y + 1 });
  }
  if (x > 0 && y > 0) {
    hits.push({ x: x - 1, y: y - 1 });
  }
  if (x < 9 && y < 9) {
    hits.push({ x: x + 1, y: y + 1 });
  }
  if (x > 0 && y < 9) {
    hits.push({ x: x - 1, y: y + 1 });
  }
  if (x < 9 && y > 0) {
    hits.push({ x: x + 1, y: y - 1 });
  }
};

export const getHitsAroundShip = (user, ship) => {
  const hits = [];
  const addX = ship.direction ? 0 : 1;
  const addY = ship.direction ? 1 : 0;

  for (let i = 0; i < ship.length; i++) {
    getHitsAround(ship.position.x + i * addX, ship.position.y + i * addY, hits);
  }

  return hits
    .reduce((acc, hit) => {
      if (!acc.some((h) => h.x === hit.x && h.y === hit.y)) {
        acc.push(hit);
      }
      return acc;
    }, [])
    .filter((hit) => !isHit(user, hit.x, hit.y));
};
