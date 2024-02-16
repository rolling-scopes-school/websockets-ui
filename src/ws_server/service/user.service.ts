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
}
