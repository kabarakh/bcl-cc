<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/common/Input.vue";
import Textarea from "@/components/common/Textarea.vue";
import Button from "@/components/common/Button.vue";
import { useRouteStore } from "@/stores/routeStore";
import type { Route } from "@/types/Route";

const props = defineProps<{
  wallId: number;
  modelValue?: Route;
}>();

const emit = defineEmits<{
  close: [];
}>();

const routeStore = useRouteStore();

const difficulty = ref(props.modelValue?.difficulty ?? "");
const type = ref(props.modelValue?.type ?? "");
const color = ref(props.modelValue?.color ?? "#3b82f6");
const setDate = ref(props.modelValue?.setDate ?? new Date().toISOString().slice(0, 10));
const mediaText = ref((props.modelValue?.media ?? []).join(", "));
const error = ref<string>();

watch(
  () => props.modelValue,
  (route) => {
    difficulty.value = route?.difficulty ?? "";
    type.value = route?.type ?? "";
    color.value = route?.color ?? "#3b82f6";
    setDate.value = route?.setDate ?? new Date().toISOString().slice(0, 10);
    mediaText.value = (route?.media ?? []).join(", ");
  }
);

function parseMedia(): string[] {
  return mediaText.value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

async function handleSubmit() {
  error.value = undefined;
  if (difficulty.value.trim().length === 0) {
    error.value = "Bitte eine Schwierigkeit angeben.";
    return;
  }
  const input = {
    wallId: props.wallId,
    difficulty: difficulty.value.trim(),
    type: type.value.trim() || undefined,
    color: color.value,
    setDate: setDate.value,
    media: parseMedia(),
    archived: props.modelValue?.archived ?? false
  };
  if (props.modelValue?.id !== undefined) {
    await routeStore.update(props.modelValue.id, input);
  } else {
    await routeStore.create(input);
  }
  emit("close");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <Input v-model="difficulty" label="Schwierigkeit" placeholder="z. B. 6A+" required :error="error" />
    <Input v-model="type" label="Typ (optional)" placeholder="z. B. crimpy, slopey" />
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-900">Farbe</label>
      <input v-model="color" type="color" class="h-10 w-16 cursor-pointer rounded-sm border border-gray-300" />
    </div>
    <Input v-model="setDate" type="date" label="Geschraubt am" />
    <Textarea v-model="mediaText" label="Medien (kommagetrennte Links, optional)" />
    <div class="flex justify-end gap-2">
      <Button type="button" variant="secondary" @click="emit('close')">Abbrechen</Button>
      <Button type="submit" variant="primary">Speichern</Button>
    </div>
  </form>
</template>
