<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";

const isOpen = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    title?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    title: undefined,
    size: "md"
  }
);

const sizeClasses: Record<NonNullable<typeof props.size>, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl"
};

function close() {
  isOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    close();
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

watch(isOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      @mousedown.self="close"
    >
      <div class="w-full rounded-lg bg-white shadow-lg" :class="sizeClasses[size]">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <button
            type="button"
            class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Schliessen"
            @click="close"
          >
            &#x2715;
          </button>
        </div>
        <div class="px-5 py-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
