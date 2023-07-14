import { WebSocketServer } from "ws";
import { updateWinners } from "./server/broadcast";

export interface User {
  name: string,
  password: string,
  wins: number
}

export interface UserData {
  name: string,
  index: number,
  roomIndex: number,
  gameIndex: number,
  ws?: WebSocket,
  wss?: WebSocketServer
}

export class UserDB{
  private db: Array<User> = []

  createUser(name: string, password: string) {
    const data = {
      name: name,
      index: this.db.length,
      error: false,
      errorText: ""
    }
    if (this.db.find(user => user.name === name)) {
      data.error = true;
      data.errorText = "Already have user with same name";
      return data;
    }
    const user: User = {
      name: name,
      password: password,
      wins: 0
    }
    this.db.push(user);
    return data;
  }

  addWin(index: number) {
    if (index === -1)
      return;
    this.db[index].wins ++;
  }

  getDB(): Array<User> {
    return this.db;
  }
}

export interface Room {
  roomId: number,
  roomUsers: Array<UserData>
}

export class RoomDB {
  private db: Array<Room> = []

  createRoom(): number {
    const room: Room = {
      roomId: this.db.length,
      roomUsers: []
    }
    this.db.push(room);
    return room.roomId;
  }

  addUserToRoom(indexRoom: number, userData: UserData) {
    if (userData.roomIndex !== -1)
      this.db[userData.roomIndex].roomUsers = this.db[userData.roomIndex].roomUsers.filter(user => user.name !== userData.name);
    
    userData.roomIndex = indexRoom;
    this.db[indexRoom].roomUsers.push(userData);
    if (this.db[indexRoom].roomUsers.length === 2) {
      games.push(new Game(this.db[indexRoom].roomUsers, games.length, userData.index === -1));
    }
  }

  deleteFromRoom(userData: UserData) {
    this.db[userData.roomIndex].roomUsers = [];
  }

  singleRoom(indexRoom: number, userData: UserData) {
    this.addUserToRoom(indexRoom, userData);
    const bot: UserData = {
      name: 'bot',
      index: -1,
      roomIndex: indexRoom,
      gameIndex: -1,
    }
    this.addUserToRoom(indexRoom, bot);
  }

  getDB(): Array<Room> {
    return this.db;
  }
}

interface Ship {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: "small" | "medium" | "large" | "huge"
}

class Game {
  users: Array<UserData>
  state = 'new'
  id: number
  currentPlayer = 0
  field: Array<Array<Array<string>>> = [[], []]
  shipsGot = 0
  ships: Array<Array<Ship>> = [[], []]
  shipsDestroyed = [0, 0]
  isSingle = false

  constructor(users: Array<UserData>, id: number, isSingle: boolean) {
    this.users = users;
    this.id = id;
    this.users.forEach(user => {
      user.gameIndex = this.id;
    })
    this.createGame();
    this.field.forEach(field => {
      for (let i = 0; i < 10; i++) {
        field.push([]);
        for (let j = 0; j < 10; j++) {
          field[i].push('water');
        }
      }
    })
    this.isSingle = isSingle;
    if (this.isSingle) {
      this.shipsGot++;
      this.generateShips();
    }
  }

  canPlaceShip (x, y, dir, len): boolean {
    for (let step = 0; step < len; step++) {
      if (x < 0 || y < 0 || x >= 10 || y >= 10)
        return false;
      if (this.field[1][x][y] !== 'water')
        return false;
      if (x - 1 >= 0 && y - 1 >= 0 && this.field[1][x - 1][y - 1] !== 'water')
        return false;
      if (x - 1 >= 0 && this.field[1][x - 1][y] !== 'water')
        return false;
      if (x - 1 >= 0 && y + 1 < 10 && this.field[1][x - 1][y + 1] !== 'water')
        return false;
      if (y - 1 >= 0 && this.field[1][x][y - 1] !== 'water')
        return false;
      if (y + 1 < 10 && this.field[1][x][y + 1] !== 'water')
        return false;
      if (x + 1 < 10 && y - 1 >= 0 && this.field[1][x + 1][y - 1] !== 'water')
        return false;
      if (x + 1 < 10 && this.field[1][x + 1][y] !== 'water')
        return false;
      if (x + 1 < 10 && y + 1 < 10 && this.field[1][x + 1][y + 1] !== 'water')
        return false;
      if (dir)
        y++;
      else
        x++;
    }
    return true;
  }

  generateShips() {
    for (let length = 4; length >= 1; length--) {
      for (let step = 0; step <= 4 - length; step++) {
        let x, y, direction = false;
        do {
          x = Math.floor(Math.random() * 10);
          y = Math.floor(Math.random() * 10);
          direction = Math.random() < 0.5;
        } while (!this.canPlaceShip(x, y, direction, length))
        for (let step2 = 0; step2 < length; step2++) {
          this.field[1][x][y] = 'ship';
          if (direction)
            y++;
          else
            x++;
        }
      }
    }
  }

  createGame() {
    this.state = 'create';
    const data = {
      idGame: this.id,
      idPlayer: 0
    }
    this.users.forEach((user, id) => {
      if (user.index === -1)
        return;
      data.idPlayer = id;
      const table = {
        type: "create_game",
        data: JSON.stringify(data),
        id: 0,
      };
      user.ws.send(JSON.stringify(table));
    })
  }

  addShips(data) {
    const field = this.field[data.indexPlayer];
    data.ships.forEach(ship => {
      let x = ship.position.x;
      let y = ship.position.y;
      for (let step = 0; step < ship.length; step++) {
        field[x][y] = 'ship';
        if (ship.direction)
          y++;
        else
          x++;
      }
    })
    this.shipsGot++;
    this.ships[data.indexPlayer] = data.ships;
    if (this.shipsGot === 2)
      this.startGame();
  }

  startGame() {
    this.state = 'game';
    const data = {
      ships: [],
      currentPlayerIndex: 0
    }
    this.users.forEach((user, id) => {
      if (user.index === -1)
        return;
      data.ships = this.ships[id];
      data.currentPlayerIndex = id;
      const table = {
        type: "start_game",
        data: JSON.stringify(data),
        id: 0,
      };
      user.ws.send(JSON.stringify(table));
    })
    this.turn();
  }

  turn() {
    if (this.shipsDestroyed[0] === 20) {
      const data = {
        winPlayer: 0
      }
      const table = {
        type: "finish",
        data: JSON.stringify(data),
        id: 0,
      };
      this.users.forEach((user, id) => {
        if (user.index === -1)
          return;
        user.ws.send(JSON.stringify(table));
      })
      userDB.addWin(this.users[0].index);
      updateWinners(this.users[0].wss);
      roomDB.deleteFromRoom(this.users[0]);
      roomDB.deleteFromRoom(this.users[1]);
      return;
    } else if (this.shipsDestroyed[1] === 20) {
      const data = {
        winPlayer: 1
      }
      const table = {
        type: "finish",
        data: JSON.stringify(data),
        id: 0,
      };
      this.users.forEach((user, id) => {
        if (user.index === -1)
          return;
        user.ws.send(JSON.stringify(table));
      })
      userDB.addWin(this.users[1].index);
      updateWinners(this.users[0].wss);
      roomDB.deleteFromRoom(this.users[0]);
      roomDB.deleteFromRoom(this.users[1]);
      return;
    }
    const data = {
      currentPlayer: this.currentPlayer
    }
    const table = {
      type: "turn",
      data: JSON.stringify(data),
      id: 0,
    };
    this.users.forEach((user, id) => {
      if (user.index === -1)
        return;
      user.ws.send(JSON.stringify(table));
    })
    if (this.currentPlayer === 1 && this.isSingle) {
      const data = {
        gameId: this.id,
        indexPlayer: 1
      }
      this.randomAttack(data);
    }
  }

  randomAttack(dataAttack) {
    const isShootGood = (field, x, y): boolean => {

      if (field[x][y] === 'killed' || field[x][y] == 'wreck')
        return false;
      if (x - 1 >= 0 && y - 1 >= 0 && field[x - 1][y - 1] === 'killed')
        return false;
      if (x - 1 >= 0 && field[x - 1][y] === 'killed')
        return false;
      if (x - 1 >= 0 && y + 1 < 10 && field[x - 1][y + 1] === 'killed')
        return false;
      if (y - 1 >= 0 && field[x][y - 1] === 'killed')
        return false;
      if (y + 1 < 10 && field[x][y + 1] === 'killed')
        return false;
      if (x + 1 < 10 && y - 1 >= 0 && field[x + 1][y - 1] === 'killed')
        return false;
      if (x + 1 < 10 && field[x + 1][y] === 'killed')
        return false;
      if (x + 1 < 10 && y + 1 < 10 && field[x + 1][y + 1] === 'killed')
        return false;
      return true;
    }
    let x = 0, y = 0;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (!isShootGood(this.field[1 - dataAttack.indexPlayer], x, y));
    const data = {
      x: x,
      y: y,
      indexPlayer: dataAttack.indexPlayer
    }
    this.attack(data);
  }

  attack(dataAttack) {
    if (dataAttack.indexPlayer !== this.currentPlayer)
      return;
    const x = dataAttack.x;
    const y = dataAttack.y;
    const field = this.field[1 - dataAttack.indexPlayer];
    const data = {
      position: {
        x: x,
        y: y
      },
      currentPlayer: dataAttack.indexPlayer,
      status: 'miss'
    }
    if (field[x][y] !== 'ship') {
      this.currentPlayer = 1 - this.currentPlayer;
      data.status = 'miss';
      if (field[x][y] === 'wreck')
        data.status = 'shot';
      else if (field[x][y] === 'killed')
        data.status = 'killed';
      const table = {
        type: "attack",
        data: JSON.stringify(data),
        id: 0,
      };
      this.users.forEach(user => {
        if (user.index === -1)
          return;
        user.ws.send(JSON.stringify(table));
      });
      this.turn();
      return;
    }

    this.shipsDestroyed[dataAttack.indexPlayer]++;

    data.status = 'killed';
    field[x][y] = 'wreck';
    for (let X = x; X >= 0; X--) {
      if (field[X][y] === 'water')
        break;
      if (field[X][y] === 'ship')
        data.status = 'shot';
    }
    for (let X = x; X < 10; X++) {
      if (field[X][y] === 'water')
        break;
      if (field[X][y] === 'ship')
        data.status = 'shot';
    }
    for (let Y = y; Y >= 0; Y--) {
      if (field[x][Y] === 'water')
        break;
      if (field[x][Y] === 'ship')
        data.status = 'shot';
    }
    for (let Y = y; Y < 10; Y++) {
      if (field[x][Y] === 'water')
        break;
      if (field[x][Y] === 'ship')
        data.status = 'shot';
    }

    if (data.status === 'killed') {
      const table = {
        type: "attack",
        data: JSON.stringify(data),
        id: 0,
      };
      for (let X = x; X >= 0; X--) {
        if (field[X][y] === 'water')
          break;
        this.sendAttack(X, y, field, data, table);
      }
      for (let X = x; X < 10; X++) {
        if (field[X][y] === 'water')
          break;
        this.sendAttack(X, y, field, data, table);
      }
      for (let Y = y; Y >= 0; Y--) {
        if (field[x][Y] === 'water')
          break;
        this.sendAttack(x, Y, field, data, table);
      }
      for (let Y = y; Y < 10; Y++) {
        if (field[x][Y] === 'water')
          break;
        this.sendAttack(x, Y, field, data, table);
      }
    } else {
      const table = {
        type: "attack",
        data: JSON.stringify(data),
        id: 0,
      };
      this.users.forEach(user => {
        if (user.index === -1)
          return;
        user.ws.send(JSON.stringify(table));
      });
    }
    this.turn();
  }

  sendAttack(x: number, y: number, field, data, table) {
    field[x][y] = 'killed';
    data.position.x = x;
    data.position.y = y;
    data.status = 'killed';
    table.data = JSON.stringify(data);
    this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    if (x - 1 >= 0 && y - 1 >= 0 && field[x - 1][y - 1] === 'water') {
      data.position.x = x - 1;
      data.position.y = y - 1;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x - 1 >= 0 && y >= 0 && field[x - 1][y] === 'water') {
      data.position.x = x - 1;
      data.position.y = y;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x - 1 >= 0 && y + 1 < 10 && field[x - 1][y + 1] === 'water') {
      data.position.x = x - 1;
      data.position.y = y + 1;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x >= 0 && y + 1 < 10 && field[x][y + 1] === 'water') {
      data.position.x = x;
      data.position.y = y + 1;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x >= 0 && y - 1 >= 0 && field[x][y - 1] === 'water') {
      data.position.x = x;
      data.position.y = y - 1;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x + 1 < 10 && y - 1 >= 0 && field[x + 1][y - 1] === 'water') {
      data.position.x = x + 1;
      data.position.y = y - 1;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x + 1 < 10 && y >= 0 && field[x + 1][y] === 'water') {
      data.position.x = x + 1;
      data.position.y = y;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
    if (x + 1 < 10 && y + 1 < 10 && field[x + 1][y + 1] === 'water') {
      data.position.x = x + 1;
      data.position.y = y + 1;
      data.status = 'miss';
      table.data = JSON.stringify(data);
      this.users.forEach(user => { if (user.index !== -1) user.ws.send(JSON.stringify(table)) });
    }
  }
}

const userDB = new UserDB();
const roomDB = new RoomDB();
const games: Array<Game> = [];

export { userDB, roomDB, games }