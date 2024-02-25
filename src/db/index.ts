import { Player } from '../server/models/Player';
import { Room } from '../server/models/Room';

export class Database {
  private static instance: Database;
  private constructor() {}
  private data: Map<string, any[]> = new Map();

  public static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getCollection(name: string): Array<any> {
    if (!this.data.has(name)) {
      this.data.set(name, []);
    }

    return this.data.get(name)?.slice() ?? [];
  }

  addValue(collectionName: string, values: unknown) {
    if (!this.data.has(collectionName)) {
      this.data.set(collectionName, [values]);
    }

    const collection = this.data.get(collectionName);
    collection?.push(values);
  }

  getValue(collectionName: string, id: string) {
    if (!this.data.has(collectionName)) {
      return;
    }

    const collection = this.data.get(collectionName);
    return collection?.find((item) => String(item.id) === id);
  }

  removeValue(collectionName: string, id: string) {
    const collection = this.data.get(collectionName);

    if (!collection) {
      return;
    }

    const index = collection.findIndex((item) => item.id === id);

    if (index === -1) {
      return;
    }

    const [user] = collection.splice(index, 1);
    return user;
  }

  updateValue(collectionName: string, id: string, values: any) {
    if (!this.data.has(collectionName)) {
      return;
    }

    const collection = this.data.get(collectionName);
    const index = collection?.findIndex((item) => item.id === id);

    if (!collection || !index || index === -1) {
      return;
    }

    collection[index] = values;
  }

  clearCollection(collectionName: string) {
    this.data.set(collectionName, []);
  }
}

export default Database.getInstance();
