import { defineStore } from "pinia";
import { areaRepository } from "@/repositories/areaRepository";
import { deleteAreaCascade } from "@/services/cascade";
import type { HallArea, HallAreaInput } from "@/types/HallArea";

interface AreaState {
  items: HallArea[];
  loading: boolean;
}

export const useAreaStore = defineStore("area", {
  state: (): AreaState => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id: number) => state.items.find((area) => area.id === id),
    byHall: (state) => (hallId: number) => state.items.filter((area) => area.hallId === hallId)
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.items = await areaRepository.getAll();
      } finally {
        this.loading = false;
      }
    },

    async create(input: HallAreaInput) {
      await areaRepository.create(input);
      await this.load();
    },

    async update(id: number, changes: Partial<HallAreaInput>) {
      await areaRepository.update(id, changes);
      await this.load();
    },

    async remove(id: number) {
      await areaRepository.delete(id);
      this.items = this.items.filter((area) => area.id !== id);
    },

    async removeCascade(id: number) {
      await deleteAreaCascade(id);
      this.items = this.items.filter((area) => area.id !== id);
    }
  }
});
