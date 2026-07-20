import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/repositories/hallRepository", () => ({
  hallRepository: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock("@/services/cascade", () => ({
  deleteHallCascade: vi.fn()
}));

import { useHallStore } from "@/stores/hallStore";
import { hallRepository } from "@/repositories/hallRepository";
import { deleteHallCascade } from "@/services/cascade";

const hall = (id: number, name: string) => ({
  id,
  name,
  address: "Adresse",
  createdAt: "now",
  updatedAt: "now"
});

describe("hallStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loads halls into state", async () => {
    vi.mocked(hallRepository.getAll).mockResolvedValue([hall(1, "Halle Nord")]);

    const store = useHallStore();
    await store.load();

    expect(store.items).toHaveLength(1);
    expect(store.loading).toBe(false);
  });

  it("byId finds a hall by id", async () => {
    vi.mocked(hallRepository.getAll).mockResolvedValue([hall(5, "Halle 5")]);
    const store = useHallStore();
    await store.load();

    expect(store.byId(5)?.name).toBe("Halle 5");
    expect(store.byId(999)).toBeUndefined();
  });

  it("create delegates to the repository and reloads", async () => {
    vi.mocked(hallRepository.create).mockResolvedValue(1);
    vi.mocked(hallRepository.getAll).mockResolvedValue([hall(1, "Neue Halle")]);

    const store = useHallStore();
    await store.create({ name: "Neue Halle", address: "Adresse" });

    expect(hallRepository.create).toHaveBeenCalledWith({
      name: "Neue Halle",
      address: "Adresse"
    });
    expect(store.items).toHaveLength(1);
  });

  it("update delegates to the repository and reloads", async () => {
    vi.mocked(hallRepository.getAll).mockResolvedValue([hall(1, "Geaenderter Name")]);

    const store = useHallStore();
    await store.update(1, { name: "Geaenderter Name" });

    expect(hallRepository.update).toHaveBeenCalledWith(1, { name: "Geaenderter Name" });
    expect(store.items[0].name).toBe("Geaenderter Name");
  });

  it("remove deletes via the repository and updates state locally", async () => {
    vi.mocked(hallRepository.getAll).mockResolvedValue([hall(1, "A"), hall(2, "B")]);
    const store = useHallStore();
    await store.load();

    await store.remove(1);

    expect(hallRepository.delete).toHaveBeenCalledWith(1);
    expect(store.items.map((h) => h.id)).toEqual([2]);
  });

  it("removeCascade delegates to the cascade service", async () => {
    vi.mocked(hallRepository.getAll).mockResolvedValue([hall(1, "A")]);
    const store = useHallStore();
    await store.load();

    await store.removeCascade(1);

    expect(deleteHallCascade).toHaveBeenCalledWith(1);
    expect(store.items).toHaveLength(0);
  });
});
