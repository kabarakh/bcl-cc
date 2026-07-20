<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useHallStore } from "@/stores/hallStore";
import { useAreaStore } from "@/stores/areaStore";
import { useWallStore } from "@/stores/wallStore";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import ListLayout from "@/components/common/ListLayout.vue";
import Modal from "@/components/common/Modal.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import Button from "@/components/common/Button.vue";
import HallForm from "@/components/hall/HallForm.vue";
import AreaCard from "@/components/area/AreaCard.vue";
import AreaForm from "@/components/area/AreaForm.vue";

const props = defineProps<{
  hallId: string;
}>();

const router = useRouter();
const hallStore = useHallStore();
const areaStore = useAreaStore();
const wallStore = useWallStore();

const isEditModalOpen = ref(false);
const isCreateAreaModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);

const hallIdNumber = computed(() => Number(props.hallId));

onMounted(async () => {
  await Promise.all([hallStore.load(), areaStore.load(), wallStore.load()]);
});

const hall = computed(() => hallStore.byId(hallIdNumber.value));
const areas = computed(() => areaStore.byHall(hallIdNumber.value));

watchEffect(() => {
  const notLoading = !hallStore.loading;
  if (notLoading && (Number.isNaN(hallIdNumber.value) || (hallStore.items.length > 0 && !hall.value))) {
    router.replace({ name: "not-found" });
  }
});

async function onDeleteConfirmed() {
  await hallStore.removeCascade(hallIdNumber.value);
  router.push({ name: "halls" });
}
</script>

<template>
  <Navbar />

  <main v-if="hall" class="mx-auto max-w-5xl px-4 py-8">
    <Breadcrumb :items="[{ label: 'Hallen', to: { name: 'halls' } }, { label: hall.name }]" />

    <PageHeader :title="hall.name" :subtitle="hall.address">
      <template #actions>
        <Button variant="secondary" @click="isEditModalOpen = true">Bearbeiten</Button>
        <Button variant="danger" @click="isDeleteConfirmOpen = true">Halle löschen</Button>
      </template>
    </PageHeader>

    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Bereiche</h2>
      <Button variant="primary" @click="isCreateAreaModalOpen = true">Bereich anlegen</Button>
    </div>

    <ListLayout
      :items="areas"
      :loading="areaStore.loading"
      empty-message="Noch keine Bereiche in dieser Halle."
    >
      <template #item="{ item }">
        <AreaCard :area="item" />
      </template>
    </ListLayout>
  </main>

  <Modal v-model="isEditModalOpen" title="Halle bearbeiten">
    <HallForm :model-value="hall" @close="isEditModalOpen = false" />
  </Modal>

  <Modal v-model="isCreateAreaModalOpen" title="Bereich anlegen">
    <AreaForm :hall-id="hallIdNumber" @close="isCreateAreaModalOpen = false" />
  </Modal>

  <ConfirmDialog
    v-model="isDeleteConfirmOpen"
    title="Halle löschen"
    message="Damit werden auch alle Bereiche, Wände, Routen und Versuche dieser Halle unwiderruflich gelöscht."
    confirm-label="Endgültig löschen"
    danger
    @confirm="onDeleteConfirmed"
  />
</template>
