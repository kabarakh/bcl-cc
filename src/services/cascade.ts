import { hallRepository } from "@/repositories/hallRepository";
import { areaRepository } from "@/repositories/areaRepository";
import { wallRepository } from "@/repositories/wallRepository";
import { routeRepository } from "@/repositories/routeRepository";
import { attemptRepository } from "@/repositories/attemptRepository";

async function deleteWallCascade(wallId: number): Promise<void> {
  const routes = await routeRepository.getByWall(wallId, true);
  for (const route of routes) {
    const attempts = await attemptRepository.getByRoute(route.id!);
    await Promise.all(attempts.map((attempt) => attemptRepository.delete(attempt.id!)));
    await routeRepository.delete(route.id!);
  }
  await wallRepository.delete(wallId);
}

export async function deleteAreaCascade(hallAreaId: number): Promise<void> {
  const walls = await wallRepository.getByArea(hallAreaId);
  for (const wall of walls) {
    await deleteWallCascade(wall.id!);
  }
  await areaRepository.delete(hallAreaId);
}

export async function deleteHallCascade(hallId: number): Promise<void> {
  const areas = await areaRepository.getByHall(hallId);
  for (const area of areas) {
    await deleteAreaCascade(area.id!);
  }
  await hallRepository.delete(hallId);
}

export async function deleteRouteCascade(routeId: number): Promise<void> {
  const attempts = await attemptRepository.getByRoute(routeId);
  await Promise.all(attempts.map((attempt) => attemptRepository.delete(attempt.id!)));
  await routeRepository.delete(routeId);
}
