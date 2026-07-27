<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 p-10 text-center dark:border-gray-700"
  >
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
  </div>
</template>
