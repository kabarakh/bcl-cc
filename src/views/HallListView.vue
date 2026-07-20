<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHallStore } from "@/stores/hallStore";
import { useAreaStore } from "@/stores/areaStore";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import ListLayout from "@/components/common/ListLayout.vue";
import Modal from "@/components/common/Modal.vue";
import Button from "@/components/common/Button.vue";
import HallCard from "@/components/hall/HallCard.vue";
import HallForm from "@/components/hall/HallForm.vue";

const hallStore = useHallStore();
const areaStore = useAreaStore();

const isModalOpen = ref(false);

onMounted(async () => {
  await Promise.all([hallStore.load(), areaStore.load()]);
});

const halls = computed(() => hallStore.items);
</script>

<template>
  <Navbar />

  <main class="mx-auto max-w-5xl px-4 py-8">
    <PageHeader title="Boulderhallen" subtitle="Alle erfassten Hallen im Überblick">
      <template #actions>
        <Button variant="primary" @click="isModalOpen = true">Neue Halle</Button>
      </template>
    </PageHeader>

    <ListLayout
      :items="halls"
      :loading="hallStore.loading"
      empty-message="Noch keine Hallen erfasst. Lege deine erste Halle an."
    >
      <template #item="{ item }">
        <HallCard :hall="item" />
      </template>
    </ListLayout>
  </main>

  <Modal v-model="isModalOpen" title="Neue Halle">
    <HallForm @close="isModalOpen = false" />
  </Modal>
</template>
