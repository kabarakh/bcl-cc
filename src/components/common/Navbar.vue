<script setup lang="ts">
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();
</script>

<template>
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Boulder Tracker
      </RouterLink>
      <div class="flex items-center gap-3">
        <slot />
        <button
          type="button"
          class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus:ring-gray-700"
          :aria-label="themeStore.isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'"
          :aria-pressed="themeStore.isDark"
          @click="themeStore.toggle()"
        >
          <svg
            v-if="themeStore.isDark"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
