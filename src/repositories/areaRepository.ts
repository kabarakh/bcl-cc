import { db } from "@/db/database";
import { BaseRepository } from "./baseRepository";
import type { HallArea, HallAreaInput } from "@/types/HallArea";

export class AreaRepository extends BaseRepository<HallArea, HallAreaInput> {
  constructor() {
    super(db.hallAreas);
  }

  async getByHall(hallId: number): Promise<HallArea[]> {
    return this.table.where("hallId").equals(hallId).toArray();
  }
}

export const areaRepository = new AreaRepository();
