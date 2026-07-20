<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  type: "button",
  loading: false,
  disabled: false
});

const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-300",
  secondary: "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 focus:ring-gray-200",
  danger: "bg-red-700 hover:bg-red-800 text-white focus:ring-red-300"
};
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus:outline-hidden focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60"
    :class="variantClasses[props.variant]"
  >
    <span
      v-if="props.loading"
      class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
