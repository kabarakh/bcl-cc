<script setup lang="ts" generic="T">
import EmptyState from "./EmptyState.vue";

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
      <span
        class="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-700 dark:border-gray-700 dark:border-t-blue-500"
        aria-hidden="true"
      />
    </div>
    <EmptyState v-else-if="items.length === 0" :message="emptyMessage" />
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <slot v-for="(item, index) in items" :key="index" name="item" :item="item" :index="index" />
    </div>
  </div>
</template>
