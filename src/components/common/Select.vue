<script setup lang="ts">
interface Option {
  label: string;
  value: string;
}

const model = defineModel<string>();

withDefaults(
  defineProps<{
    label: string;
    options: Option[];
    error?: string;
  }>(),
  {
    error: undefined
  }
);

const selectId = `select-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div>
    <label :for="selectId" class="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
      {{ label }}
    </label>
    <select
      :id="selectId"
      v-model="model"
      class="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-hidden focus:ring-2 dark:bg-gray-800 dark:text-gray-100"
      :class="
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900'
      "
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>
