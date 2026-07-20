import { describe, it, expect } from "vitest";
import { hallRepository } from "@/repositories/hallRepository";
import { areaRepository } from "@/repositories/areaRepository";
import { wallRepository } from "@/repositories/wallRepository";

describe("wallRepository", () => {
  it("filters walls by area", async () => {
    const hallId = await hallRepository.create({ name: "Halle", address: "A" });
    const areaId = await areaRepository.create({ hallId, name: "Bereich" });
    const otherAreaId = await areaRepository.create({ hallId, name: "Anderer Bereich" });

    await wallRepository.create({
      hallAreaId: areaId,
      name: "Wand 1",
      type: "boulder",
      lastSetDate: "2026-06-01"
    });
    await wallRepository.create({
      hallAreaId: otherAreaId,
      name: "Wand 2",
      type: "traverse",
      lastSetDate: "2026-06-15"
    });

    const walls = await wallRepository.getByArea(areaId);

    expect(walls).toHaveLength(1);
    expect(walls[0].name).toBe("Wand 1");
  });
});
