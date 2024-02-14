import { User } from "../service/client-service/types";

export class Storage {
  private users: Map<string, User>;
  private rooms: Map<string, string>;
  private winners: Map<string, number>;
  constructor() {
    this.users = new Map<string, User>();
  }
}
