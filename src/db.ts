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
  ws: WebSocket,
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
      console.log(JSON.stringify(this.db.find(user => user.name === name)));
      data.errorText = "Already have user with same name";
      return data;
    }
    const user: User = {
      name: name,
      password: password,
      wins: 0
    }
    this.db.push(user);
    console.log(this.db);
    return data;
  }

  addWin(index: number) {
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
    console.log('JOIN', indexRoom, userData);
    this.db[indexRoom].roomUsers.push(userData);
    if (this.db[indexRoom].roomUsers.length === 2) {
      games.push(new Game(this.db[indexRoom].roomUsers, games.length));
    }
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

  constructor(users: Array<UserData>, id : number) {
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
  }

  createGame() {
    this.state = 'create';
    const data = {
      idGame: this.id,
      idPlayer: 0
    }
    this.users.forEach((user, id) => {
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
    console.log('start Game!');
    const data = {
      ships: [],
      currentPlayerIndex: 0
    }
    this.users.forEach((user, id) => {
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
    const data = {
      currentPlayer: this.currentPlayer
    }
    const table = {
      type: "turn",
      data: JSON.stringify(data),
      id: 0,
    };
    this.users.forEach((user, id) => {
      user.ws.send(JSON.stringify(table));
    })
  }
}

const userDB = new UserDB();
const roomDB = new RoomDB();
const games: Array<Game> = [];

export { userDB, roomDB, games }