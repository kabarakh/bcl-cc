<script setup lang="ts">
import { formatDate } from "@/utils/dates";
import type { Attempt } from "@/types/Attempt";

defineProps<{
  attempts: Attempt[];
}>();
</script>

<template>
  <ul class="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
    <li v-for="attempt in attempts" :key="attempt.id" class="flex items-start gap-3 p-3">
      <span
        class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold text-white"
        :class="attempt.success ? 'bg-green-600 dark:bg-green-700' : 'bg-gray-400 dark:bg-gray-600'"
        aria-hidden="true"
      >
        {{ attempt.success ? "✓" : "✕" }}
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ formatDate(attempt.date) }}
          <span class="font-normal text-gray-500 dark:text-gray-400">
            -- {{ attempt.success ? "Erfolgreich" : "Kein Erfolg" }}
          </span>
        </p>
        <p v-if="attempt.notes" class="text-sm text-gray-500 dark:text-gray-400">
          {{ attempt.notes }}
        </p>
        <a
          v-if="attempt.media"
          :href="attempt.media"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-blue-700 hover:underline dark:text-blue-400"
        >
          Medium ansehen
        </a>
      </div>
    </li>
  </ul>
</template>
