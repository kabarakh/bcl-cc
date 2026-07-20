import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/repositories/routeRepository", () => ({
  routeRepository: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock("@/services/cascade", () => ({
  deleteRouteCascade: vi.fn()
}));

import { useRouteStore } from "@/stores/routeStore";
import { routeRepository } from "@/repositories/routeRepository";
import { deleteRouteCascade } from "@/services/cascade";

const route = (id: number, wallId: number, archived = false) => ({
  id,
  wallId,
  difficulty: "6A",
  media: [],
  color: "blue",
  setDate: "2026-06-01",
  archived,
  createdAt: "now",
  updatedAt: "now"
});

describe("routeStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("byWall excludes archived routes by default", async () => {
    vi.mocked(routeRepository.getAll).mockResolvedValue([
      route(1, 10, false),
      route(2, 10, true)
    ]);

    const store = useRouteStore();
    await store.load();

    expect(store.byWall(10).map((r) => r.id)).toEqual([1]);
    expect(store.byWall(10, true).map((r) => r.id)).toEqual([1, 2]);
  });

  it("archive updates the route to archived = true", async () => {
    vi.mocked(routeRepository.getAll).mockResolvedValue([route(1, 10, true)]);

    const store = useRouteStore();
    await store.archive(1);

    expect(routeRepository.update).toHaveBeenCalledWith(1, { archived: true });
    expect(store.items[0].archived).toBe(true);
  });

  it("removeCascade delegates to the cascade service", async () => {
    vi.mocked(routeRepository.getAll).mockResolvedValue([route(1, 10)]);
    const store = useRouteStore();
    await store.load();

    await store.removeCascade(1);

    expect(deleteRouteCascade).toHaveBeenCalledWith(1);
    expect(store.items).toHaveLength(0);
  });
});
