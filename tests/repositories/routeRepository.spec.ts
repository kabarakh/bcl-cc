import { describe, it, expect } from "vitest";
import { hallRepository } from "@/repositories/hallRepository";
import { areaRepository } from "@/repositories/areaRepository";
import { wallRepository } from "@/repositories/wallRepository";
import { routeRepository } from "@/repositories/routeRepository";

async function createWall() {
  const hallId = await hallRepository.create({ name: "Halle", address: "A" });
  const areaId = await areaRepository.create({ hallId, name: "Bereich" });
  return wallRepository.create({
    hallAreaId: areaId,
    name: "Wand",
    type: "boulder",
    lastSetDate: "2026-06-01"
  });
}

describe("routeRepository", () => {
  it("filters out archived routes by default", async () => {
    const wallId = await createWall();

    await routeRepository.create({
      wallId,
      difficulty: "6A",
      media: [],
      color: "blue",
      setDate: "2026-06-01",
      archived: false
    });
    await routeRepository.create({
      wallId,
      difficulty: "6B",
      media: [],
      color: "red",
      setDate: "2026-01-01",
      archived: true
    });

    const active = await routeRepository.getByWall(wallId);
    const all = await routeRepository.getByWall(wallId, true);

    expect(active).toHaveLength(1);
    expect(active[0].difficulty).toBe("6A");
    expect(all).toHaveLength(2);
  });
});
