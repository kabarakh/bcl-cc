<script setup lang="ts">
import { ref } from "vue";
import {
  FwbAlert,
  FwbBadge,
  FwbBreadcrumb,
  FwbBreadcrumbItem,
  FwbButton,
  FwbCard,
  FwbInput,
  FwbSelect,
  FwbTextarea
} from "flowbite-vue";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import Modal from "@/components/common/Modal.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import ListLayout from "@/components/common/ListLayout.vue";

interface SampleRoute {
  id: number;
  difficulty: string;
  color: string;
}

const sampleRoutes: SampleRoute[] = [
  { id: 1, difficulty: "6A", color: "#eab308" },
  { id: 2, difficulty: "6C+", color: "#3b82f6" },
  { id: 3, difficulty: "7A", color: "#ef4444" }
];

const emptyItems: SampleRoute[] = [];

const textValue = ref("");
const notesValue = ref("");
const selectValue = ref("boulder");
const selectOptions = [
  { name: "Boulderwand", value: "boulder" },
  { name: "Quergang", value: "traverse" }
];

const isModalOpen = ref(false);
const isConfirmOpen = ref(false);
const lastAction = ref("");
</script>

<template>
  <Navbar>
    <span class="text-sm text-gray-500 dark:text-gray-400">Komponenten-Playground</span>
  </Navbar>

  <main class="mx-auto max-w-5xl space-y-10 px-4 py-8">
    <FwbBreadcrumb class="mb-0">
      <FwbBreadcrumbItem home>
        <RouterLink to="/">Start</RouterLink>
      </FwbBreadcrumbItem>
      <FwbBreadcrumbItem>Playground</FwbBreadcrumbItem>
    </FwbBreadcrumb>

    <PageHeader title="Komponenten-Playground" subtitle="Manueller Durchklick-Test der Flowbite-Bausteine">
      <template #actions>
        <FwbButton type="button" color="alternative" @click="isModalOpen = true">Modal öffnen</FwbButton>
        <FwbButton type="button" color="red" @click="isConfirmOpen = true">Löschen (Confirm)</FwbButton>
      </template>
    </PageHeader>

    <FwbAlert v-if="lastAction" type="success">{{ lastAction }}</FwbAlert>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Buttons</h2>
      <div class="flex flex-wrap gap-3">
        <FwbButton type="button" color="default">Primary</FwbButton>
        <FwbButton type="button" color="alternative">Secondary</FwbButton>
        <FwbButton type="button" color="red">Danger</FwbButton>
        <FwbButton type="button" color="default" loading>Loading</FwbButton>
        <FwbButton type="button" color="default" disabled>Disabled</FwbButton>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Formularfelder</h2>
      <div class="grid max-w-md gap-4">
        <FwbInput v-model="textValue" label="Name" placeholder="z. B. Boulderhalle Nord" required />
        <FwbInput v-model="textValue" label="Mit Fehler" validation-status="error">
          <template #validationMessage>Dieses Feld ist erforderlich.</template>
        </FwbInput>
        <FwbTextarea v-model="notesValue" label="Notizen" />
        <FwbSelect v-model="selectValue" label="Wandtyp" :options="selectOptions" />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Badge</h2>
      <div class="flex gap-2">
        <FwbBadge type="yellow">6A gelb</FwbBadge>
        <FwbBadge type="default">6C+ blau</FwbBadge>
        <FwbBadge type="red">7A rot</FwbBadge>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">ListLayout mit Cards (gefüllt)</h2>
      <ListLayout :items="sampleRoutes" :loading="false">
        <template #item="{ item }">
          <RouterLink :to="{ name: 'playground' }" class="block h-full">
            <FwbCard class="min-w-0! h-full w-full cursor-pointer transition hover:shadow-lg dark:hover:bg-gray-700">
              <div class="flex items-center justify-between p-4">
                <span class="font-medium">{{ item.difficulty }}</span>
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  :style="{ backgroundColor: item.color }"
                >
                  Farbe
                </span>
              </div>
            </FwbCard>
          </RouterLink>
        </template>
      </ListLayout>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">ListLayout leer (FwbAlert als Empty State)</h2>
      <ListLayout :items="emptyItems" :loading="false" empty-message="Noch keine Routen erfasst." />
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">ListLayout ladend (FwbSpinner)</h2>
      <ListLayout :items="emptyItems" :loading="true" />
    </section>
  </main>

  <Modal v-model="isModalOpen" title="Beispiel-Modal">
    <p class="text-sm text-gray-700 dark:text-gray-300">Dies ist ein Beispieltext im Modal-Body.</p>
    <template #footer>
      <FwbButton type="button" color="alternative" @click="isModalOpen = false">Schliessen</FwbButton>
      <FwbButton type="button" color="default" @click="isModalOpen = false">Speichern</FwbButton>
    </template>
  </Modal>

  <ConfirmDialog
    v-model="isConfirmOpen"
    message="Soll dieser Eintrag wirklich gelöscht werden?"
    danger
    @confirm="lastAction = 'Löschen bestätigt'"
  />
</template>
