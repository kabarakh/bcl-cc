import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/repositories/attemptRepository", () => ({
  attemptRepository: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

import { useAttemptStore } from "@/stores/attemptStore";
import { attemptRepository } from "@/repositories/attemptRepository";

const attempt = (id: number, routeId: number, date: string, success: boolean) => ({
  id,
  routeId,
  date,
  success,
  createdAt: "now",
  updatedAt: "now"
});

describe("attemptStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("byRoute returns attempts sorted by date", async () => {
    vi.mocked(attemptRepository.getAll).mockResolvedValue([
      attempt(1, 10, "2026-07-05", true),
      attempt(2, 10, "2026-07-01", false)
    ]);

    const store = useAttemptStore();
    await store.load();

    expect(store.byRoute(10).map((a) => a.id)).toEqual([2, 1]);
  });

  it("stats computes flash when the first attempt succeeded", async () => {
    vi.mocked(attemptRepository.getAll).mockResolvedValue([
      attempt(1, 10, "2026-07-01", true)
    ]);
    const store = useAttemptStore();
    await store.load();

    const stats = store.stats(10);

    expect(stats).toEqual({ total: 1, successCount: 1, successRate: 1, flash: true });
  });

  it("stats is not flash when the first attempt failed", async () => {
    vi.mocked(attemptRepository.getAll).mockResolvedValue([
      attempt(1, 10, "2026-07-01", false),
      attempt(2, 10, "2026-07-03", true)
    ]);
    const store = useAttemptStore();
    await store.load();

    const stats = store.stats(10);

    expect(stats).toEqual({ total: 2, successCount: 1, successRate: 0.5, flash: false });
  });

  it("stats returns zeroed values for a route without attempts", async () => {
    vi.mocked(attemptRepository.getAll).mockResolvedValue([]);
    const store = useAttemptStore();
    await store.load();

    expect(store.stats(999)).toEqual({
      total: 0,
      successCount: 0,
      successRate: 0,
      flash: false
    });
  });
});
