<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/common/Card.vue";
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
  <Card :to="to">
    <h3 class="font-semibold text-gray-900">{{ area.name }}</h3>
    <p class="mt-2 text-xs text-gray-400">
      {{ wallCount }} {{ wallCount === 1 ? "Wand" : "Waende" }}
    </p>
  </Card>
</template>
