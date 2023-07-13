export interface User {
  name: string,
  password: string,
  wins: number
}

export interface UserData {
  name: string,
  index: number,
  roomIndex: number
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
  }

  getDB(): Array<Room> {
    return this.db;
  }
}

const userDB = new UserDB();
const roomDB = new RoomDB();

export { userDB, roomDB }