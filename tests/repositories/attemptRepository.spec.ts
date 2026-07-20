import { describe, it, expect } from "vitest";
import { hallRepository } from "@/repositories/hallRepository";
import { areaRepository } from "@/repositories/areaRepository";
import { wallRepository } from "@/repositories/wallRepository";
import { routeRepository } from "@/repositories/routeRepository";
import { attemptRepository } from "@/repositories/attemptRepository";

async function createRoute() {
  const hallId = await hallRepository.create({ name: "Halle", address: "A" });
  const areaId = await areaRepository.create({ hallId, name: "Bereich" });
  const wallId = await wallRepository.create({
    hallAreaId: areaId,
    name: "Wand",
    type: "boulder",
    lastSetDate: "2026-06-01"
  });
  return routeRepository.create({
    wallId,
    difficulty: "6A",
    media: [],
    color: "blue",
    setDate: "2026-06-01",
    archived: false
  });
}

describe("attemptRepository", () => {
  it("returns attempts for a route sorted by date", async () => {
    const routeId = await createRoute();

    await attemptRepository.create({ routeId, date: "2026-07-03", success: false });
    await attemptRepository.create({ routeId, date: "2026-07-01", success: false });
    await attemptRepository.create({ routeId, date: "2026-07-05", success: true });

    const attempts = await attemptRepository.getByRoute(routeId);

    expect(attempts.map((attempt) => attempt.date)).toEqual([
      "2026-07-01",
      "2026-07-03",
      "2026-07-05"
    ]);
  });
});
