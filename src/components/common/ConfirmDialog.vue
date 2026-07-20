<script setup lang="ts">
import Modal from "./Modal.vue";
import Button from "./Button.vue";

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
    title: "Bitte bestaetigen",
    confirmLabel: "Bestaetigen",
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
  <Modal :model-value="isOpen" :title="title" size="sm" @update:model-value="handleCancel">
    <p class="text-sm text-gray-700">{{ message }}</p>

    <template #footer>
      <Button variant="secondary" @click="handleCancel">{{ cancelLabel }}</Button>
      <Button :variant="danger ? 'danger' : 'primary'" @click="handleConfirm">
        {{ confirmLabel }}
      </Button>
    </template>
  </Modal>
</template>
