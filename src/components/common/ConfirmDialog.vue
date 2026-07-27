<script setup lang="ts">
import { FwbButton, FwbModal } from "flowbite-vue";

const isOpen = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
  }>(),
  {
    title: "Bitte bestätigen",
    confirmLabel: "Bestätigen",
    cancelLabel: "Abbrechen",
    danger: false
  }
);

const emit = defineEmits<{
  confirm: [];
}>();

function handleCancel() {
  isOpen.value = false;
}

function handleConfirm() {
  isOpen.value = false;
  emit("confirm");
}
</script>

<template>
  <FwbModal v-if="isOpen" size="sm" @close="handleCancel">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
    </template>
    <template #body>
      <p class="text-sm text-gray-700 dark:text-gray-300">{{ message }}</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <FwbButton type="button" color="alternative" @click="handleCancel">
          {{ cancelLabel }}
        </FwbButton>
        <FwbButton type="button" :color="danger ? 'red' : 'default'" @click="handleConfirm">
          {{ confirmLabel }}
        </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
