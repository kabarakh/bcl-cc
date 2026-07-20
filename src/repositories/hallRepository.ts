import { db } from "@/db/database";
import { BaseRepository } from "./baseRepository";
import type { Hall, HallInput } from "@/types/Hall";

export class HallRepository extends BaseRepository<Hall, HallInput> {
  constructor() {
    super(db.halls);
  }
}

export const hallRepository = new HallRepository();
