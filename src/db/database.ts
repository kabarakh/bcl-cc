import Dexie, { type Table } from "dexie";
import { DB_NAME, DB_VERSION, SCHEMA_V1 } from "./schema";
import type { Hall } from "@/types/Hall";
import type { HallArea } from "@/types/HallArea";
import type { Wall } from "@/types/Wall";
import type { Route } from "@/types/Route";
import type { Attempt } from "@/types/Attempt";

export class BoulderTrackerDB extends Dexie {
  halls!: Table<Hall, number>;
  hallAreas!: Table<HallArea, number>;
  walls!: Table<Wall, number>;
  routes!: Table<Route, number>;
  attempts!: Table<Attempt, number>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(SCHEMA_V1);
  }
}

export const db = new BoulderTrackerDB();
