import { describe, it, expect } from "vitest";
import { hallRepository } from "@/repositories/hallRepository";
import { areaRepository } from "@/repositories/areaRepository";
import { wallRepository } from "@/repositories/wallRepository";
import { routeRepository } from "@/repositories/routeRepository";
import { attemptRepository } from "@/repositories/attemptRepository";
import { deleteHallCascade, deleteAreaCascade, deleteRouteCascade } from "@/services/cascade";

async function seed() {
  const hallId = await hallRepository.create({ name: "Halle", address: "A" });
  const areaId = await areaRepository.create({ hallId, name: "Bereich" });
  const wallId = await wallRepository.create({
    hallAreaId: areaId,
    name: "Wand",
    type: "boulder",
    lastSetDate: "2026-06-01"
  });
  const routeId = await routeRepository.create({
    wallId,
    difficulty: "6A",
    media: [],
    color: "blue",
    setDate: "2026-06-01",
    archived: false
  });
  const attemptId = await attemptRepository.create({
    routeId,
    date: "2026-07-01",
    success: true
  });

  return { hallId, areaId, wallId, routeId, attemptId };
}

describe("cascade", () => {
  it("deleteHallCascade removes hall, area, wall, route and attempt", async () => {
    const { hallId, areaId, wallId, routeId, attemptId } = await seed();

    await deleteHallCascade(hallId);

    expect(await hallRepository.get(hallId)).toBeUndefined();
    expect(await areaRepository.get(areaId)).toBeUndefined();
    expect(await wallRepository.get(wallId)).toBeUndefined();
    expect(await routeRepository.get(routeId)).toBeUndefined();
    expect(await attemptRepository.get(attemptId)).toBeUndefined();
  });

  it("deleteAreaCascade leaves sibling areas untouched", async () => {
    const { hallId, areaId } = await seed();
    const otherAreaId = await areaRepository.create({ hallId, name: "Andere" });

    await deleteAreaCascade(areaId);

    expect(await areaRepository.get(areaId)).toBeUndefined();
    expect(await areaRepository.get(otherAreaId)).toBeDefined();
  });

  it("deleteRouteCascade removes only the route's attempts", async () => {
    const { routeId, attemptId } = await seed();

    await deleteRouteCascade(routeId);

    expect(await routeRepository.get(routeId)).toBeUndefined();
    expect(await attemptRepository.get(attemptId)).toBeUndefined();
  });
});
