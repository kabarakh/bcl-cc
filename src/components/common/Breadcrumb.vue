<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

interface BreadcrumbItem {
  label: string;
  to?: RouteLocationRaw;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav class="mb-4" aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1.5">
        <span v-if="index > 0" aria-hidden="true">/</span>
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-blue-700 hover:underline"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="font-medium text-gray-900">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
