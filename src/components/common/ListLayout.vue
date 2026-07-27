<script setup lang="ts" generic="T">
import { FwbAlert, FwbSpinner } from "flowbite-vue";

withDefaults(
  defineProps<{
    items: T[];
    loading?: boolean;
    emptyMessage?: string;
  }>(),
  {
    loading: false,
    emptyMessage: "Keine Einträge vorhanden."
  }
);
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center py-10">
      <FwbSpinner size="6" />
    </div>
    <FwbAlert v-else-if="items.length === 0" type="info">{{ emptyMessage }}</FwbAlert>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <slot v-for="(item, index) in items" :key="index" name="item" :item="item" :index="index" />
    </div>
  </div>
</template>
