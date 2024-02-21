import { WebSocket } from "ws";
import { getIndex } from "../db/helpers";
import { User } from "../db/models";
import { DB } from "../db/storage";

export class UserService {
  private storage: DB;
  constructor(storage: DB) {
    this.storage = storage;
  }

  logIn(data: User, ws: WebSocket) {
    const { name, password } = data;
    const user = this.storage.getUser({ name });
    if (user) {
      user.ws = ws;
      return user.password == password
        ? {
            name,
            index: user.index,
            error: false,
          }
        : { error: true, errorText: "Invalid password" };
    }
    const index = getIndex(this.storage.users);
    this.storage.users.set(index, new User({ name, password, index, ws }));
    this.storage.usersNames.set(name, index);
    return { name, index, error: false };
  }

  logOut(index: number) {
    const user = this.storage.users.get(index);
    this.storage.games.delete(user.gameIndex);
    user.gameIndex = undefined;
    user.ships = undefined;
    user.shipsKill = 0;
    user.pastAttacks = new Set<string>();
  }
}
