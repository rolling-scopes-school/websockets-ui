import { Storage } from "src/ws_server/DB";
import { User } from "../client/types";

export class PlayerService {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  logIn(data: User) {
    const { name, password } = data;
    const checkUser = this.storage.getUser({ name });

    if (checkUser.index) {
      return checkUser.password == password
        ? {
            name,
            index: checkUser.index,
            error: false,
          }
        : { error: true, errorText: "Invalid password" };
    }
    const newPlayer = this.storage.addUser({ name, password });
    return { name, index: newPlayer.index, error: false };
  }
}
