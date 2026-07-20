<script setup lang="ts"></script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
    <h1 class="text-2xl font-semibold text-gray-700">Seite nicht gefunden</h1>
    <p class="text-sm text-gray-500">Der aufgerufene Eintrag existiert nicht (mehr).</p>
    <RouterLink :to="{ name: 'halls' }" class="text-sm text-blue-700 hover:underline">
      Zurück zur Hallenübersicht
    </RouterLink>
  </main>
</template>
