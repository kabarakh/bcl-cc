<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to?: RouteLocationRaw;
}>();
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="block cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-xs transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
  >
    <slot />
  </RouterLink>
  <div
    v-else
    class="rounded-lg border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900"
  >
    <slot />
  </div>
</template>
