<script setup lang="ts">
const model = defineModel<string>();

withDefaults(
  defineProps<{
    label: string;
    rows?: number;
    error?: string;
  }>(),
  {
    rows: 3,
    error: undefined
  }
);

const textareaId = `textarea-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div>
    <label :for="textareaId" class="mb-1 block text-sm font-medium text-gray-900">
      {{ label }}
    </label>
    <textarea
      :id="textareaId"
      v-model="model"
      :rows="rows"
      class="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-hidden focus:ring-2"
      :class="
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
      "
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
