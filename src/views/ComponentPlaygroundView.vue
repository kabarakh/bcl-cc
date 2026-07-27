<script setup lang="ts">
import { ref } from "vue";
import Navbar from "@/components/common/Navbar.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import Button from "@/components/common/Button.vue";
import Card from "@/components/common/Card.vue";
import Badge from "@/components/common/Badge.vue";
import Input from "@/components/common/Input.vue";
import Textarea from "@/components/common/Textarea.vue";
import Select from "@/components/common/Select.vue";
import Modal from "@/components/common/Modal.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import EmptyState from "@/components/common/EmptyState.vue";
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
  { label: "Boulderwand", value: "boulder" },
  { label: "Quergang", value: "traverse" }
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
    <Breadcrumb :items="[{ label: 'Start', to: '/' }, { label: 'Playground' }]" />

    <PageHeader title="Komponenten-Playground" subtitle="Phase 3 -- manueller Durchklick-Test">
      <template #actions>
        <Button variant="secondary" @click="isModalOpen = true">Modal öffnen</Button>
        <Button variant="danger" @click="isConfirmOpen = true">Löschen (Confirm)</Button>
      </template>
    </PageHeader>

    <p
      v-if="lastAction"
      class="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-400"
    >
      {{ lastAction }}
    </p>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Buttons</h2>
      <div class="flex gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Formularfelder</h2>
      <div class="grid max-w-md gap-4">
        <Input v-model="textValue" label="Name" placeholder="z. B. Boulderhalle Nord" required />
        <Input v-model="textValue" label="Mit Fehler" error="Dieses Feld ist erforderlich." />
        <Textarea v-model="notesValue" label="Notizen" />
        <Select v-model="selectValue" label="Wandtyp" :options="selectOptions" />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Badge</h2>
      <div class="flex gap-2">
        <Badge color="#eab308">6A gelb</Badge>
        <Badge color="#3b82f6">6C+ blau</Badge>
        <Badge color="#ef4444">7A rot</Badge>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">ListLayout mit Cards (gefüllt)</h2>
      <ListLayout :items="sampleRoutes" :loading="false">
        <template #item="{ item }">
          <Card :to="{ name: 'playground' }">
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ item.difficulty }}</span>
              <Badge :color="item.color">Farbe</Badge>
            </div>
          </Card>
        </template>
      </ListLayout>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">ListLayout leer (EmptyState)</h2>
      <ListLayout :items="emptyItems" :loading="false" empty-message="Noch keine Routen erfasst.">
        <template #item="{ item }">
          <Card>{{ item }}</Card>
        </template>
      </ListLayout>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">ListLayout ladend</h2>
      <ListLayout :items="emptyItems" :loading="true">
        <template #item="{ item }">
          <Card>{{ item }}</Card>
        </template>
      </ListLayout>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">EmptyState</h2>
      <EmptyState message="Keine Hallen vorhanden." />
    </section>
  </main>

  <Modal v-model="isModalOpen" title="Beispiel-Modal">
    <p class="text-sm text-gray-700 dark:text-gray-300">Dies ist ein Beispieltext im Modal-Body.</p>
    <template #footer>
      <Button variant="secondary" @click="isModalOpen = false">Schliessen</Button>
      <Button variant="primary" @click="isModalOpen = false">Speichern</Button>
    </template>
  </Modal>

  <ConfirmDialog
    v-model="isConfirmOpen"
    message="Soll dieser Eintrag wirklich gelöscht werden?"
    danger
    @confirm="lastAction = 'Löschen bestätigt'"
  />
</template>
