import { defineStore } from "pinia";
import { hallRepository } from "@/repositories/hallRepository";
import { deleteHallCascade } from "@/services/cascade";
import type { Hall, HallInput } from "@/types/Hall";

interface HallState {
  items: Hall[];
  loading: boolean;
}

export const useHallStore = defineStore("hall", {
  state: (): HallState => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id: number) => state.items.find((hall) => hall.id === id)
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.items = await hallRepository.getAll();
      } finally {
        this.loading = false;
      }
    },

    async create(input: HallInput) {
      await hallRepository.create(input);
      await this.load();
    },

    async update(id: number, changes: Partial<HallInput>) {
      await hallRepository.update(id, changes);
      await this.load();
    },

    async remove(id: number) {
      await hallRepository.delete(id);
      this.items = this.items.filter((hall) => hall.id !== id);
    },

    async removeCascade(id: number) {
      await deleteHallCascade(id);
      this.items = this.items.filter((hall) => hall.id !== id);
    }
  }
});
