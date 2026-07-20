import "fake-indexeddb/auto";
import { beforeEach } from "vitest";
import { db } from "@/db/database";

beforeEach(async () => {
  await db.halls.clear();
  await db.hallAreas.clear();
  await db.walls.clear();
  await db.routes.clear();
  await db.attempts.clear();
});
