import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/repositories/wallRepository", () => ({
  wallRepository: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

import { useWallStore } from "@/stores/wallStore";
import { wallRepository } from "@/repositories/wallRepository";

const wall = (id: number, hallAreaId: number, name: string) => ({
  id,
  hallAreaId,
  name,
  type: "boulder" as const,
  lastSetDate: "2026-06-01",
  createdAt: "now",
  updatedAt: "now"
});

describe("wallStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("byArea filters walls by hallAreaId", async () => {
    vi.mocked(wallRepository.getAll).mockResolvedValue([
      wall(1, 100, "Wand A"),
      wall(2, 200, "Wand B")
    ]);

    const store = useWallStore();
    await store.load();

    expect(store.byArea(100).map((w) => w.id)).toEqual([1]);
  });

  it("remove deletes via the repository and updates state locally", async () => {
    vi.mocked(wallRepository.getAll).mockResolvedValue([wall(1, 100, "Wand A")]);
    const store = useWallStore();
    await store.load();

    await store.remove(1);

    expect(wallRepository.delete).toHaveBeenCalledWith(1);
    expect(store.items).toHaveLength(0);
  });
});
