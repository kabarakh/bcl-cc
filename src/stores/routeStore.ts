import { defineStore } from "pinia";
import { routeRepository } from "@/repositories/routeRepository";
import { deleteRouteCascade } from "@/services/cascade";
import type { Route, RouteInput } from "@/types/Route";

interface RouteState {
  items: Route[];
  loading: boolean;
}

export const useRouteStore = defineStore("route", {
  state: (): RouteState => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id: number) => state.items.find((route) => route.id === id),
    byWall:
      (state) =>
      (wallId: number, includeArchived = false) =>
        state.items.filter(
          (route) => route.wallId === wallId && (includeArchived || !route.archived)
        )
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.items = await routeRepository.getAll();
      } finally {
        this.loading = false;
      }
    },

    async create(input: RouteInput) {
      await routeRepository.create(input);
      await this.load();
    },

    async update(id: number, changes: Partial<RouteInput>) {
      await routeRepository.update(id, changes);
      await this.load();
    },

    async archive(id: number) {
      await this.update(id, { archived: true });
    },

    async remove(id: number) {
      await routeRepository.delete(id);
      this.items = this.items.filter((route) => route.id !== id);
    },

    async removeCascade(id: number) {
      await deleteRouteCascade(id);
      this.items = this.items.filter((route) => route.id !== id);
    }
  }
});
