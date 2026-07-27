<script setup lang="ts">
import { computed } from "vue";
import { FwbCard } from "flowbite-vue";
import { useWallStore } from "@/stores/wallStore";
import type { HallArea } from "@/types/HallArea";

const props = defineProps<{
  area: HallArea;
}>();

const wallStore = useWallStore();

const wallCount = computed(() =>
  props.area.id === undefined ? 0 : wallStore.byArea(props.area.id).length
);

const to = computed(() => ({ name: "area", params: { areaId: props.area.id } }));
</script>

<template>
  <RouterLink :to="to" class="block h-full">
    <FwbCard class="min-w-0! h-full w-full cursor-pointer transition hover:shadow-lg dark:hover:bg-gray-700">
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ area.name }}</h3>
        <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {{ wallCount }} {{ wallCount === 1 ? "Wand" : "Wände" }}
        </p>
      </div>
    </FwbCard>
  </RouterLink>
</template>
