<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { FwbBadge, FwbBreadcrumb, FwbBreadcrumbItem, FwbButton } from "flowbite-vue";
import { useHallStore } from "@/stores/hallStore";
import { useAreaStore } from "@/stores/areaStore";
import { useWallStore } from "@/stores/wallStore";
import { useRouteStore } from "@/stores/routeStore";
import { useAttemptStore } from "@/stores/attemptStore";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import Modal from "@/components/common/Modal.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import RouteForm from "@/components/route/RouteForm.vue";
import AttemptForm from "@/components/route/AttemptForm.vue";
import AttemptList from "@/components/route/AttemptList.vue";
import { formatDate } from "@/utils/dates";

const props = defineProps<{
  routeId: string;
}>();

const router = useRouter();
const hallStore = useHallStore();
const areaStore = useAreaStore();
const wallStore = useWallStore();
const routeStore = useRouteStore();
const attemptStore = useAttemptStore();

const isEditModalOpen = ref(false);
const isAttemptModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);

const routeIdNumber = computed(() => Number(props.routeId));

onMounted(async () => {
  await Promise.all([
    hallStore.load(),
    areaStore.load(),
    wallStore.load(),
    routeStore.load(),
    attemptStore.load()
  ]);
});

const route = computed(() => routeStore.byId(routeIdNumber.value));
const wall = computed(() => (route.value ? wallStore.byId(route.value.wallId) : undefined));
const area = computed(() => (wall.value ? areaStore.byId(wall.value.hallAreaId) : undefined));
const hall = computed(() => (area.value ? hallStore.byId(area.value.hallId) : undefined));

const attempts = computed(() => attemptStore.byRoute(routeIdNumber.value));
const stats = computed(() => attemptStore.stats(routeIdNumber.value));

watchEffect(() => {
  const notLoading = !routeStore.loading;
  if (
    notLoading &&
    (Number.isNaN(routeIdNumber.value) || (routeStore.items.length > 0 && !route.value))
  ) {
    router.replace({ name: "not-found" });
  }
});

async function onArchiveToggle() {
  if (!route.value) return;
  await routeStore.update(routeIdNumber.value, { archived: !route.value.archived });
}

async function onDeleteConfirmed() {
  await routeStore.removeCascade(routeIdNumber.value);
  if (wall.value?.id !== undefined) {
    router.push({ name: "wall", params: { wallId: wall.value.id } });
  } else {
    router.push({ name: "halls" });
  }
}
</script>

<template>
  <Navbar />

  <main v-if="route" class="mx-auto max-w-5xl px-4 py-8">
    <FwbBreadcrumb class="mb-4">
      <FwbBreadcrumbItem home>
        <RouterLink :to="{ name: 'halls' }">Hallen</RouterLink>
      </FwbBreadcrumbItem>
      <FwbBreadcrumbItem v-if="hall">
        <RouterLink :to="{ name: 'hall', params: { hallId: hall.id! } }">{{ hall.name }}</RouterLink>
      </FwbBreadcrumbItem>
      <FwbBreadcrumbItem v-if="area">
        <RouterLink :to="{ name: 'area', params: { areaId: area.id! } }">{{ area.name }}</RouterLink>
      </FwbBreadcrumbItem>
      <FwbBreadcrumbItem v-if="wall">
        <RouterLink :to="{ name: 'wall', params: { wallId: wall.id! } }">{{ wall.name }}</RouterLink>
      </FwbBreadcrumbItem>
      <FwbBreadcrumbItem>{{ route.difficulty }}</FwbBreadcrumbItem>
    </FwbBreadcrumb>

    <PageHeader :title="route.difficulty" :subtitle="route.type">
      <template #actions>
        <FwbButton type="button" color="alternative" @click="isEditModalOpen = true">
          Bearbeiten
        </FwbButton>
        <FwbButton type="button" color="alternative" @click="onArchiveToggle">
          {{ route.archived ? "Wieder aktivieren" : "Archivieren" }}
        </FwbButton>
        <FwbButton type="button" color="red" @click="isDeleteConfirmOpen = true">
          Route löschen
        </FwbButton>
      </template>
    </PageHeader>

    <div class="mb-6 flex flex-wrap items-center gap-4">
      <!-- Frei waehlbarer Hex-Farbwert -- kein Fall fuer FwbBadge (feste Palette). -->
      <span
        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
        :style="{ backgroundColor: route.color }"
      >
        {{ route.color }}
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Geschraubt am {{ formatDate(route.setDate) }}
      </span>
      <span v-if="route.archived" class="text-sm font-medium text-amber-600 dark:text-amber-500">
        Archiviert
      </span>
    </div>

    <div v-if="route.media.length > 0" class="mb-6 flex flex-wrap gap-2">
      <a
        v-for="(link, index) in route.media"
        :key="index"
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        Medium {{ index + 1 }}
      </a>
    </div>

    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Versuche</h2>
        <FwbBadge type="green">{{ Math.round(stats.successRate * 100) }}% Erfolg</FwbBadge>
        <FwbBadge type="dark">{{ stats.total }} gesamt</FwbBadge>
        <FwbBadge v-if="stats.flash" type="yellow">Flash</FwbBadge>
      </div>
      <FwbButton type="button" color="default" @click="isAttemptModalOpen = true">
        Versuch protokollieren
      </FwbButton>
    </div>

    <p v-if="attempts.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
      Noch keine Versuche für diese Route erfasst.
    </p>
    <AttemptList v-else :attempts="attempts" />
  </main>

  <Modal v-model="isEditModalOpen" title="Route bearbeiten">
    <RouteForm :wall-id="route?.wallId ?? 0" :model-value="route" @close="isEditModalOpen = false" />
  </Modal>

  <Modal v-model="isAttemptModalOpen" title="Versuch protokollieren">
    <AttemptForm :route-id="routeIdNumber" @close="isAttemptModalOpen = false" />
  </Modal>

  <ConfirmDialog
    v-model="isDeleteConfirmOpen"
    title="Route löschen"
    message="Damit werden auch alle protokollierten Versuche dieser Route unwiderruflich gelöscht."
    confirm-label="Endgültig löschen"
    danger
    @confirm="onDeleteConfirmed"
  />
</template>
