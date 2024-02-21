import { User, Game } from "./models";

export class DB {
  users: Map<number, User>;
  usersNames: Map<string, number>;
  games = new Map<number, Game>();
  winners = new Map<number, { name: string; wins: number }>();
  constructor() {
    this.users = new Map<number, User>();
    this.usersNames = new Map<string, number>();
  }

  getUser(where: { name?: string; index?: number }) {
    const { name, index } = where;
    if (index) {
      return this.users.get(index);
    }
    if (name) {
      const index = this.usersNames.get(name);
      return this.users.get(index);
    }
  }
}
