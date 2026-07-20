<script setup lang="ts"></script>

<template>
  <header class="border-b border-gray-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="text-lg font-semibold text-gray-900">Boulder Tracker</RouterLink>
      <slot />
    </div>
  </header>
</template>
