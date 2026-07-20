import { describe, it, expect } from "vitest";
import { hallRepository } from "@/repositories/hallRepository";
import { areaRepository } from "@/repositories/areaRepository";

describe("areaRepository", () => {
  it("filters areas by hall", async () => {
    const hallA = await hallRepository.create({ name: "Halle A", address: "A" });
    const hallB = await hallRepository.create({ name: "Halle B", address: "B" });

    await areaRepository.create({ hallId: hallA, name: "Boulderbereich" });
    await areaRepository.create({ hallId: hallA, name: "Seilbereich" });
    await areaRepository.create({ hallId: hallB, name: "Anderer Bereich" });

    const areasOfHallA = await areaRepository.getByHall(hallA);

    expect(areasOfHallA).toHaveLength(2);
    expect(areasOfHallA.every((area) => area.hallId === hallA)).toBe(true);
  });
});
