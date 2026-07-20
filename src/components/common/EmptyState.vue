<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 p-10 text-center">
    <p class="text-sm text-gray-500">{{ message }}</p>
  </div>
</template>
