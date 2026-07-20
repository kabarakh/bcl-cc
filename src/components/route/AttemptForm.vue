<script setup lang="ts">
import { ref } from "vue";
import Input from "@/components/common/Input.vue";
import Textarea from "@/components/common/Textarea.vue";
import Select from "@/components/common/Select.vue";
import Button from "@/components/common/Button.vue";
import { useAttemptStore } from "@/stores/attemptStore";

const props = defineProps<{
  routeId: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const attemptStore = useAttemptStore();

const resultOptions = [
  { label: "Erfolgreich", value: "true" },
  { label: "Kein Erfolg", value: "false" }
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
    <Input v-model="date" type="date" label="Datum" required />
    <Select v-model="success" label="Ergebnis" :options="resultOptions" />
    <Textarea v-model="notes" label="Notizen (optional)" />
    <Input v-model="media" label="Medien-Link (optional)" />
    <div class="flex justify-end gap-2">
      <Button type="button" variant="secondary" @click="emit('close')">Abbrechen</Button>
      <Button type="submit" variant="primary">Speichern</Button>
    </div>
  </form>
</template>
