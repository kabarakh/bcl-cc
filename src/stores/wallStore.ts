import { defineStore } from "pinia";
import { wallRepository } from "@/repositories/wallRepository";
import type { Wall, WallInput } from "@/types/Wall";

interface WallState {
  items: Wall[];
  loading: boolean;
}

export const useWallStore = defineStore("wall", {
  state: (): WallState => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id: number) => state.items.find((wall) => wall.id === id),
    byArea: (state) => (hallAreaId: number) =>
      state.items.filter((wall) => wall.hallAreaId === hallAreaId)
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.items = await wallRepository.getAll();
      } finally {
        this.loading = false;
      }
    },

    async create(input: WallInput) {
      await wallRepository.create(input);
      await this.load();
    },

    async update(id: number, changes: Partial<WallInput>) {
      await wallRepository.update(id, changes);
      await this.load();
    },

    async remove(id: number) {
      await wallRepository.delete(id);
      this.items = this.items.filter((wall) => wall.id !== id);
    }
  }
});
