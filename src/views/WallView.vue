<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useHallStore } from "@/stores/hallStore";
import { useAreaStore } from "@/stores/areaStore";
import { useWallStore } from "@/stores/wallStore";
import { useRouteStore } from "@/stores/routeStore";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import ListLayout from "@/components/common/ListLayout.vue";
import Modal from "@/components/common/Modal.vue";
import Button from "@/components/common/Button.vue";
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
    <Breadcrumb
      :items="[
        { label: 'Hallen', to: { name: 'halls' } },
        ...(hall ? [{ label: hall.name, to: { name: 'hall', params: { hallId: hall.id! } } }] : []),
        ...(area ? [{ label: area.name, to: { name: 'area', params: { areaId: area.id! } } }] : []),
        { label: wall.name }
      ]"
    />

    <PageHeader :title="wall.name">
      <template #actions>
        <Button variant="secondary" @click="isEditModalOpen = true">Bearbeiten</Button>
      </template>
    </PageHeader>

    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Routen</h2>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input v-model="showArchived" type="checkbox" class="rounded-sm border-gray-300" />
          Archivierte anzeigen
        </label>
        <Button variant="primary" @click="isCreateRouteModalOpen = true">Kurs anlegen</Button>
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
