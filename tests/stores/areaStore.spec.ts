import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/repositories/areaRepository", () => ({
  areaRepository: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock("@/services/cascade", () => ({
  deleteAreaCascade: vi.fn()
}));

import { useAreaStore } from "@/stores/areaStore";
import { areaRepository } from "@/repositories/areaRepository";
import { deleteAreaCascade } from "@/services/cascade";

const area = (id: number, hallId: number, name: string) => ({
  id,
  hallId,
  name,
  createdAt: "now",
  updatedAt: "now"
});

describe("areaStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("byHall filters areas by hallId", async () => {
    vi.mocked(areaRepository.getAll).mockResolvedValue([
      area(1, 10, "Bereich A"),
      area(2, 20, "Bereich B"),
      area(3, 10, "Bereich C")
    ]);

    const store = useAreaStore();
    await store.load();

    expect(store.byHall(10).map((a) => a.id)).toEqual([1, 3]);
  });

  it("create delegates to the repository and reloads", async () => {
    vi.mocked(areaRepository.create).mockResolvedValue(1);
    vi.mocked(areaRepository.getAll).mockResolvedValue([area(1, 10, "Neuer Bereich")]);

    const store = useAreaStore();
    await store.create({ hallId: 10, name: "Neuer Bereich" });

    expect(areaRepository.create).toHaveBeenCalledWith({ hallId: 10, name: "Neuer Bereich" });
    expect(store.items).toHaveLength(1);
  });

  it("removeCascade delegates to the cascade service", async () => {
    vi.mocked(areaRepository.getAll).mockResolvedValue([area(1, 10, "Bereich")]);
    const store = useAreaStore();
    await store.load();

    await store.removeCascade(1);

    expect(deleteAreaCascade).toHaveBeenCalledWith(1);
    expect(store.items).toHaveLength(0);
  });
});
