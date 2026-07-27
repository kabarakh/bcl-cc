<script setup lang="ts">
import { ref } from "vue";
import { FwbButton, FwbInput, FwbSelect, FwbTextarea } from "flowbite-vue";
import { useAttemptStore } from "@/stores/attemptStore";

const props = defineProps<{
  routeId: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const attemptStore = useAttemptStore();

const resultOptions = [
  { name: "Erfolgreich", value: "true" },
  { name: "Kein Erfolg", value: "false" }
];

const date = ref(new Date().toISOString().slice(0, 10));
const success = ref("true");
const notes = ref("");
const media = ref("");

async function handleSubmit() {
  await attemptStore.create({
    routeId: props.routeId,
    date: date.value,
    success: success.value === "true",
    notes: notes.value.trim() || undefined,
    media: media.value.trim() || undefined
  });
  emit("close");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <FwbInput v-model="date" type="date" label="Datum" required />
    <FwbSelect v-model="success" label="Ergebnis" :options="resultOptions" />
    <FwbTextarea v-model="notes" label="Notizen (optional)" />
    <FwbInput v-model="media" label="Medien-Link (optional)" />
    <div class="flex justify-end gap-2">
      <FwbButton type="button" color="alternative" @click="emit('close')">Abbrechen</FwbButton>
      <FwbButton type="submit" color="default">Speichern</FwbButton>
    </div>
  </form>
</template>
