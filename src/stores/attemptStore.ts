import { defineStore } from "pinia";
import { attemptRepository } from "@/repositories/attemptRepository";
import type { Attempt, AttemptInput } from "@/types/Attempt";

interface AttemptState {
  items: Attempt[];
  loading: boolean;
}

export interface RouteStats {
  total: number;
  successCount: number;
  successRate: number;
  flash: boolean;
}

function sortByDate(attempts: Attempt[]): Attempt[] {
  return [...attempts].sort((a, b) => a.date.localeCompare(b.date));
}

export const useAttemptStore = defineStore("attempt", {
  state: (): AttemptState => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id: number) => state.items.find((attempt) => attempt.id === id),
    byRoute: (state) => (routeId: number) =>
      sortByDate(state.items.filter((attempt) => attempt.routeId === routeId)),
    stats() {
      return (routeId: number): RouteStats => {
        const attempts = this.byRoute(routeId) as Attempt[];
        const total = attempts.length;
        const successCount = attempts.filter((attempt) => attempt.success).length;
        return {
          total,
          successCount,
          successRate: total > 0 ? successCount / total : 0,
          flash: total > 0 && attempts[0].success
        };
      };
    }
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.items = await attemptRepository.getAll();
      } finally {
        this.loading = false;
      }
    },

    async create(input: AttemptInput) {
      await attemptRepository.create(input);
      await this.load();
    },

    async update(id: number, changes: Partial<AttemptInput>) {
      await attemptRepository.update(id, changes);
      await this.load();
    },

    async remove(id: number) {
      await attemptRepository.delete(id);
      this.items = this.items.filter((attempt) => attempt.id !== id);
    }
  }
});
