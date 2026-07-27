<script setup lang="ts">
const model = defineModel<string | number>();

withDefaults(
  defineProps<{
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
  }>(),
  {
    type: "text",
    placeholder: "",
    required: false,
    error: undefined
  }
);

const inputId = `input-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div>
    <label :for="inputId" class="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
      {{ label }}
      <span v-if="required" class="text-red-600 dark:text-red-400">*</span>
    </label>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-hidden focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      :class="
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900'
      "
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>
