import { db } from "@/db/database";
import { BaseRepository } from "./baseRepository";
import type { Attempt, AttemptInput } from "@/types/Attempt";

export class AttemptRepository extends BaseRepository<Attempt, AttemptInput> {
  constructor() {
    super(db.attempts);
  }

  async getByRoute(routeId: number): Promise<Attempt[]> {
    const attempts = await this.table.where("routeId").equals(routeId).toArray();
    return attempts.sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const attemptRepository = new AttemptRepository();
