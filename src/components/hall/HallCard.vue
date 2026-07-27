<script setup lang="ts">
import { computed } from "vue";
import { FwbCard } from "flowbite-vue";
import { useAreaStore } from "@/stores/areaStore";
import type { Hall } from "@/types/Hall";

const props = defineProps<{
  hall: Hall;
}>();

const areaStore = useAreaStore();

const areaCount = computed(() =>
  props.hall.id === undefined ? 0 : areaStore.byHall(props.hall.id).length
);

const to = computed(() => ({ name: "hall", params: { hallId: props.hall.id } }));
</script>

<template>
  <RouterLink :to="to" class="block h-full">
    <FwbCard class="min-w-0! h-full w-full cursor-pointer transition hover:shadow-lg dark:hover:bg-gray-700">
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ hall.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ hall.address }}</p>
        <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {{ areaCount }} {{ areaCount === 1 ? "Bereich" : "Bereiche" }}
        </p>
      </div>
    </FwbCard>
  </RouterLink>
</template>
