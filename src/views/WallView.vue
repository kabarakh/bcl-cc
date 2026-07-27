<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { FwbBreadcrumb, FwbBreadcrumbItem, FwbButton, FwbCheckbox } from "flowbite-vue";
import { useHallStore } from "@/stores/hallStore";
import { useAreaStore } from "@/stores/areaStore";
import { useWallStore } from "@/stores/wallStore";
import { useRouteStore } from "@/stores/routeStore";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import ListLayout from "@/components/common/ListLayout.vue";
import Modal from "@/components/common/Modal.vue";
import WallForm from "@/components/wall/WallForm.vue";
import RouteCard from "@/components/route/RouteCard.vue";
import RouteForm from "@/components/route/RouteForm.vue";

const props = defineProps<{
  wallId: string;
}>();

const router = useRouter();
const hallStore = useHallStore();
const areaStore = useAreaStore();
const wallStore = useWallStore();
const routeStore = useRouteStore();

const isEditModalOpen = ref(false);
const isCreateRouteModalOpen = ref(false);
const showArchived = ref(false);

const wallIdNumber = computed(() => Number(props.wallId));

onMounted(async () => {
  await Promise.all([hallStore.load(), areaStore.load(), wallStore.load(), routeStore.load()]);
});

const wall = computed(() => wallStore.byId(wallIdNumber.value));
const area = computed(() => (wall.value ? areaStore.byId(wall.value.hallAreaId) : undefined));
const hall = computed(() => (area.value ? hallStore.byId(area.value.hallId) : undefined));
const routes = computed(() => routeStore.byWall(wallIdNumber.value, showArchived.value));

watchEffect(() => {
  const notLoading = !wallStore.loading;
  if (
    notLoading &&
    (Number.isNaN(wallIdNumber.value) || (wallStore.items.length > 0 && !wall.value))
  ) {
    router.replace({ name: "not-found" });
  }
});
</script>

<template>
  <Navbar />

  <main v-if="wall" class="mx-auto max-w-5xl px-4 py-8">
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
      <FwbBreadcrumbItem>{{ wall.name }}</FwbBreadcrumbItem>
    </FwbBreadcrumb>

    <PageHeader :title="wall.name">
      <template #actions>
        <FwbButton type="button" color="alternative" @click="isEditModalOpen = true">
          Bearbeiten
        </FwbButton>
      </template>
    </PageHeader>

    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Routen</h2>
      <div class="flex items-center gap-3">
        <FwbCheckbox v-model="showArchived" label="Archivierte anzeigen" />
        <FwbButton type="button" color="default" @click="isCreateRouteModalOpen = true">
          Kurs anlegen
        </FwbButton>
      </div>
    </div>

    <ListLayout
      :items="routes"
      :loading="routeStore.loading"
      empty-message="Noch keine Routen an dieser Wand."
    >
      <template #item="{ item }">
        <RouteCard :route="item" />
      </template>
    </ListLayout>
  </main>

  <Modal v-model="isEditModalOpen" title="Wand bearbeiten">
    <WallForm :hall-area-id="wall?.hallAreaId ?? 0" :model-value="wall" @close="isEditModalOpen = false" />
  </Modal>

  <Modal v-model="isCreateRouteModalOpen" title="Kurs anlegen">
    <RouteForm :wall-id="wallIdNumber" @close="isCreateRouteModalOpen = false" />
  </Modal>
</template>
