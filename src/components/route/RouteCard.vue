<script setup lang="ts">
import { computed } from "vue";
import { FwbCard } from "flowbite-vue";
import type { Route } from "@/types/Route";

const props = defineProps<{
  route: Route;
}>();

const to = computed(() => ({ name: "route", params: { routeId: props.route.id } }));
</script>

<template>
  <RouterLink :to="to" class="block h-full">
    <FwbCard
      class="min-w-0! h-full w-full cursor-pointer transition hover:shadow-lg dark:hover:bg-gray-700"
      :class="route.archived ? 'opacity-60' : ''"
    >
      <div class="p-4">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ route.difficulty }}</span>
          <!-- Die Routenfarbe ist ein frei waehlbarer Hex-Wert (Farbwahl im
               Formular) -- FwbBadge deckt nur ein festes Farbpalette ab,
               daher hier ein eigener Chip mit Inline-Style. -->
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            :style="{ backgroundColor: route.color }"
          >
            {{ route.color }}
          </span>
        </div>
        <p v-if="route.type" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ route.type }}
        </p>
        <p v-if="route.archived" class="mt-2 text-xs font-medium text-amber-600 dark:text-amber-500">
          Archiviert
        </p>
      </div>
    </FwbCard>
  </RouterLink>
</template>
