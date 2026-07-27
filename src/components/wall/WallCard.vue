<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/common/Card.vue";
import Badge from "@/components/common/Badge.vue";
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

const routeStore = useRouteStore();

const routeCount = computed(() =>
  props.wall.id === undefined ? 0 : routeStore.byWall(props.wall.id, true).length
);

const to = computed(() => ({ name: "wall", params: { wallId: props.wall.id } }));
</script>

<template>
  <Card :to="to">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ wall.name }}</h3>
      <Badge :color="wall.type === 'boulder' ? '#3b82f6' : '#8b5cf6'">
        {{ typeLabel[wall.type] }}
      </Badge>
    </div>
    <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
      Zuletzt geschraubt {{ formatRelative(wall.lastSetDate) }}
    </p>
    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
      {{ routeCount }} {{ routeCount === 1 ? "Route" : "Routen" }}
    </p>
  </Card>
</template>
