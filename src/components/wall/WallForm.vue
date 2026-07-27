<script setup lang="ts">
import { ref, watch } from "vue";
import { FwbButton, FwbInput, FwbSelect } from "flowbite-vue";
import { useWallStore } from "@/stores/wallStore";
import type { Wall, WallType } from "@/types/Wall";

const props = defineProps<{
  hallAreaId: number;
  modelValue?: Wall;
}>();

const emit = defineEmits<{
  close: [];
}>();

const wallStore = useWallStore();

const wallTypeOptions = [
  { name: "Boulderwand", value: "boulder" },
  { name: "Quergang", value: "traverse" }
];

const name = ref(props.modelValue?.name ?? "");
const type = ref<string>(props.modelValue?.type ?? "boulder");
const lastSetDate = ref(props.modelValue?.lastSetDate ?? new Date().toISOString().slice(0, 10));
const error = ref<string>();

watch(
  () => props.modelValue,
  (wall) => {
    name.value = wall?.name ?? "";
    type.value = wall?.type ?? "boulder";
    lastSetDate.value = wall?.lastSetDate ?? new Date().toISOString().slice(0, 10);
  }
);

async function handleSubmit() {
  error.value = undefined;
  if (name.value.trim().length < 2) {
    error.value = "Bitte mindestens 2 Zeichen eingeben.";
    return;
  }
  const input = {
    hallAreaId: props.hallAreaId,
    name: name.value.trim(),
    type: type.value as WallType,
    lastSetDate: lastSetDate.value
  };
  if (props.modelValue?.id !== undefined) {
    await wallStore.update(props.modelValue.id, input);
  } else {
    await wallStore.create(input);
  }
  emit("close");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <FwbInput
      v-model="name"
      label="Name"
      required
      :validation-status="error ? 'error' : undefined"
    >
      <template v-if="error" #validationMessage>{{ error }}</template>
    </FwbInput>
    <FwbSelect v-model="type" label="Typ" :options="wallTypeOptions" />
    <FwbInput v-model="lastSetDate" type="date" label="Zuletzt geschraubt" />
    <div class="flex justify-end gap-2">
      <FwbButton type="button" color="alternative" @click="emit('close')">Abbrechen</FwbButton>
      <FwbButton type="submit" color="default">Speichern</FwbButton>
    </div>
  </form>
</template>
