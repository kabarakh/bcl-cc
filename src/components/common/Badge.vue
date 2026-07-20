<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string;
  }>(),
  {
    color: "#6b7280"
  }
);
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
    :style="{ backgroundColor: color }"
  >
    <slot />
  </span>
</template>
