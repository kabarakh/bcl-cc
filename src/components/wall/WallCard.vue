<script setup lang="ts">
import { computed } from "vue";
import { FwbBadge, FwbCard } from "flowbite-vue";
import { formatRelative } from "@/utils/dates";
import { useRouteStore } from "@/stores/routeStore";
import type { Wall } from "@/types/Wall";

const props = defineProps<{
  wall: Wall;
}>();

const typeLabel: Record<Wall["type"], string> = {
  boulder: "Boulderwand",
  traverse: "Quergang"
};

const typeBadgeColor: Record<Wall["type"], "default" | "purple"> = {
  boulder: "default",
  traverse: "purple"
};

const routeStore = useRouteStore();

const routeCount = computed(() =>
  props.wall.id === undefined ? 0 : routeStore.byWall(props.wall.id, true).length
);

const to = computed(() => ({ name: "wall", params: { wallId: props.wall.id } }));
</script>

<template>
  <RouterLink :to="to" class="block h-full">
    <FwbCard class="min-w-0! h-full w-full cursor-pointer transition hover:shadow-lg dark:hover:bg-gray-700">
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ wall.name }}</h3>
          <FwbBadge :type="typeBadgeColor[wall.type]">{{ typeLabel[wall.type] }}</FwbBadge>
        </div>
        <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Zuletzt geschraubt {{ formatRelative(wall.lastSetDate) }}
        </p>
        <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {{ routeCount }} {{ routeCount === 1 ? "Route" : "Routen" }}
        </p>
      </div>
    </FwbCard>
  </RouterLink>
</template>
