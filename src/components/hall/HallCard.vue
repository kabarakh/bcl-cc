<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/common/Card.vue";
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
  <Card :to="to">
    <h3 class="font-semibold text-gray-900">{{ hall.name }}</h3>
    <p class="text-sm text-gray-500">{{ hall.address }}</p>
    <p class="mt-2 text-xs text-gray-400">
      {{ areaCount }} {{ areaCount === 1 ? "Bereich" : "Bereiche" }}
    </p>
  </Card>
</template>
