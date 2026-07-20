import { db } from "@/db/database";
import { BaseRepository } from "./baseRepository";
import type { Wall, WallInput } from "@/types/Wall";

export class WallRepository extends BaseRepository<Wall, WallInput> {
  constructor() {
    super(db.walls);
  }

  async getByArea(hallAreaId: number): Promise<Wall[]> {
    return this.table.where("hallAreaId").equals(hallAreaId).toArray();
  }
}

export const wallRepository = new WallRepository();
