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
    <label :for="selectId" class="mb-1 block text-sm font-medium text-gray-900">
      {{ label }}
    </label>
    <select
      :id="selectId"
      v-model="model"
      class="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-hidden focus:ring-2"
      :class="
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
      "
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
