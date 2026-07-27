<script setup lang="ts">
// Nicht mehr geroutet (seit Phase 4 zeigt "/" auf HallListView).
// Datei bleibt als Referenz/Fallback erhalten.
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-3">
    <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">Boulder Tracker</h1>
    <RouterLink to="/playground" class="text-sm text-blue-700 hover:underline dark:text-blue-400">
      Komponenten-Playground (Phase 3)
    </RouterLink>
  </main>
</template>
