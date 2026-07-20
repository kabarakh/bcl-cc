import type { Table, UpdateSpec } from "dexie";
import { nowIso } from "@/utils/dates";

export class BaseRepository<T extends { id?: number }, TInput> {
  constructor(protected table: Table<T, number>) {}

  async getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  async get(id: number): Promise<T | undefined> {
    return this.table.get(id);
  }

  async create(input: TInput): Promise<number> {
    const now = nowIso();
    const record = {
      ...input,
      createdAt: now,
      updatedAt: now
    } as unknown as T;
    return this.table.add(record);
  }

  async update(id: number, changes: Partial<TInput>): Promise<number> {
    return this.table.update(id, {
      ...changes,
      updatedAt: nowIso()
    } as unknown as UpdateSpec<T>);
  }

  async delete(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
