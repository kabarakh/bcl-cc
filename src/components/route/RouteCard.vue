<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/common/Card.vue";
import Badge from "@/components/common/Badge.vue";
import type { Route } from "@/types/Route";

const props = defineProps<{
  route: Route;
}>();

const to = computed(() => ({ name: "route", params: { routeId: props.route.id } }));
</script>

<template>
  <Card :to="to" :class="route.archived ? 'opacity-60' : ''">
    <div class="flex items-center justify-between">
      <span class="font-semibold text-gray-900">{{ route.difficulty }}</span>
      <Badge :color="route.color">{{ route.color }}</Badge>
    </div>
    <p v-if="route.type" class="mt-1 text-xs text-gray-500">{{ route.type }}</p>
    <p v-if="route.archived" class="mt-2 text-xs font-medium text-amber-600">Archiviert</p>
  </Card>
</template>
