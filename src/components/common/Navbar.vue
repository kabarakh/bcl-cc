<script setup lang="ts">
import { computed } from "vue";
import { FwbToggle } from "flowbite-vue";
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();

// FwbToggle bindet per v-model direkt an modelValue/update:modelValue. Ein
// Direct-Write auf den Store-State wuerde setDark() (localStorage,
// dark-Klasse, hasExplicitPreference) umgehen -- deshalb ueber einen
// Getter/Setter-Computed auf die Action leiten.
const isDark = computed({
  get: () => themeStore.isDark,
  set: (value: boolean) => themeStore.setDark(value)
});
</script>

<template>
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Boulder Tracker
      </RouterLink>
      <div class="flex items-center gap-4">
        <slot />
        <FwbToggle v-model="isDark" label="Dark Mode" />
      </div>
    </div>
  </header>
</template>
