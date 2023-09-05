// db.ts
import Dexie, { Table } from "dexie";

export interface Wallet {
  id?: string;
  ordinalAddress: string | undefined;
  cardinalAddress: string | null;
  wallet: string;
}

export class MySubClassedDexie extends Dexie {
  session!: Table<Wallet>;

  constructor() {
    super("session");
    this.version(1).stores({
      session: "++id, ordinalAddress, cardinalAddress, wallet", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
