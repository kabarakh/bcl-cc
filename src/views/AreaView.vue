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
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import Button from "@/components/common/Button.vue";
import AreaForm from "@/components/area/AreaForm.vue";
import WallCard from "@/components/wall/WallCard.vue";
import WallForm from "@/components/wall/WallForm.vue";

const props = defineProps<{
  areaId: string;
}>();

const router = useRouter();
const hallStore = useHallStore();
const areaStore = useAreaStore();
const wallStore = useWallStore();
const routeStore = useRouteStore();

const isEditModalOpen = ref(false);
const isCreateWallModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);

const areaIdNumber = computed(() => Number(props.areaId));

onMounted(async () => {
  await Promise.all([hallStore.load(), areaStore.load(), wallStore.load(), routeStore.load()]);
});

const area = computed(() => areaStore.byId(areaIdNumber.value));
const hall = computed(() => (area.value ? hallStore.byId(area.value.hallId) : undefined));
const walls = computed(() => wallStore.byArea(areaIdNumber.value));

watchEffect(() => {
  const notLoading = !areaStore.loading;
  if (
    notLoading &&
    (Number.isNaN(areaIdNumber.value) || (areaStore.items.length > 0 && !area.value))
  ) {
    router.replace({ name: "not-found" });
  }
});

async function onDeleteConfirmed() {
  await areaStore.removeCascade(areaIdNumber.value);
  if (hall.value?.id !== undefined) {
    router.push({ name: "hall", params: { hallId: hall.value.id } });
  } else {
    router.push({ name: "halls" });
  }
}
</script>

<template>
  <Navbar />

  <main v-if="area" class="mx-auto max-w-5xl px-4 py-8">
    <Breadcrumb
      :items="[
        { label: 'Hallen', to: { name: 'halls' } },
        ...(hall ? [{ label: hall.name, to: { name: 'hall', params: { hallId: hall.id! } } }] : []),
        { label: area.name }
      ]"
    />

    <PageHeader :title="area.name">
      <template #actions>
        <Button variant="secondary" @click="isEditModalOpen = true">Bearbeiten</Button>
        <Button variant="danger" @click="isDeleteConfirmOpen = true">Bereich löschen</Button>
      </template>
    </PageHeader>

    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Wände</h2>
      <Button variant="primary" @click="isCreateWallModalOpen = true">Wand anlegen</Button>
    </div>

    <ListLayout
      :items="walls"
      :loading="wallStore.loading"
      empty-message="Noch keine Wände in diesem Bereich."
    >
      <template #item="{ item }">
        <WallCard :wall="item" />
      </template>
    </ListLayout>
  </main>

  <Modal v-model="isEditModalOpen" title="Bereich bearbeiten">
    <AreaForm :hall-id="area?.hallId ?? 0" :model-value="area" @close="isEditModalOpen = false" />
  </Modal>

  <Modal v-model="isCreateWallModalOpen" title="Wand anlegen">
    <WallForm :hall-area-id="areaIdNumber" @close="isCreateWallModalOpen = false" />
  </Modal>

  <ConfirmDialog
    v-model="isDeleteConfirmOpen"
    title="Bereich löschen"
    message="Damit werden auch alle Wände, Routen und Versuche dieses Bereichs unwiderruflich gelöscht."
    confirm-label="Endgültig löschen"
    danger
    @confirm="onDeleteConfirmed"
  />
</template>
