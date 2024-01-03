import { User } from '../types';

const START_INDEX = 1;
type dbUser = { [id: number]:User };

export class UsersDB {
  private users: dbUser;
  private index = START_INDEX;

  constructor() {
    this.users = {};
  }
  add(name: string, password: string): User {
    let newUser: User = { index: -1, name: '' };
    if (name && password) {
      newUser = this.findByName(name);
      if (newUser.error) {
        newUser.index = this.index++;
        newUser.name = name;
        newUser.password = password;

        this.users[newUser.index] = newUser;
        newUser.error = false;
        newUser.errorText = '';
      } else {
        newUser.error = !this.checkPassword(newUser.index, password);
        newUser.errorText = newUser.error ? 'Wrong password' : '';
      }
    } else {
      newUser.error = true;
      newUser.errorText = 'Empty name or password';
    }
    return newUser;
  }

  remove() {}

  findByName(name: string): User {
    const result: User = { index: -1, name: '' };
    for (const [key, value] of Object.entries(this.users)) {
      if (name === value.name) {
        result.index = value.index;
        result.name = value.name;
        break;
      }
    }
    if (result.index === -1) {
      result.error = true;
      result.errorText = 'No such user name';
    } else {
      result.error = false;
      result.errorText = '';
    }
    return result;
  }

  getById(id: number): User {
    let user: User = this.users[id];
    if (user === null) {
      user = {
        index: -1,
        name: '',
        error: true,
        errorText: 'No such user index',
      };
    }
    return user;
  }

  private checkPassword(id: number, password: string): boolean {
    return this.users[id].password === password ? true : false;
  }
}