<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/common/Input.vue";
import Select from "@/components/common/Select.vue";
import Button from "@/components/common/Button.vue";
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
  { label: "Boulderwand", value: "boulder" },
  { label: "Quergang", value: "traverse" }
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
    <Input v-model="name" label="Name" required :error="error" />
    <Select v-model="type" label="Typ" :options="wallTypeOptions" />
    <Input v-model="lastSetDate" type="date" label="Zuletzt geschraubt" />
    <div class="flex justify-end gap-2">
      <Button type="button" variant="secondary" @click="emit('close')">Abbrechen</Button>
      <Button type="submit" variant="primary">Speichern</Button>
    </div>
  </form>
</template>
