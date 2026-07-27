<script setup lang="ts">
import { FwbModal } from "flowbite-vue";
import type { ModalSize } from "flowbite-vue/components/FwbModal/types";

const isOpen = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    title?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    title: undefined,
    size: "md"
  }
);

// Bildet unsere schlanke sm/md/lg-API auf FwbModals feinere Groessenstufen ab
// -- so bleiben die bisherigen Breiten an allen Aufrufstellen unveraendert.
const fwbSizeMap: Record<"sm" | "md" | "lg", ModalSize> = {
  sm: "sm",
  md: "lg",
  lg: "2xl"
};

function close() {
  isOpen.value = false;
}
</script>

<template>
  <FwbModal v-if="isOpen" :size="fwbSizeMap[size]" @close="close">
    <template v-if="title" #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
    </template>
    <template #body>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <div class="flex justify-end gap-2">
        <slot name="footer" />
      </div>
    </template>
  </FwbModal>
</template>
