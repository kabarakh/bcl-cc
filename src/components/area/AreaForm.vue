<script setup lang="ts">
import { ref, watch } from "vue";
import { FwbButton, FwbInput } from "flowbite-vue";
import { useAreaStore } from "@/stores/areaStore";
import type { HallArea } from "@/types/HallArea";

const props = defineProps<{
  hallId: number;
  modelValue?: HallArea;
}>();

const emit = defineEmits<{
  close: [];
}>();

const areaStore = useAreaStore();

const name = ref(props.modelValue?.name ?? "");
const error = ref<string>();

watch(
  () => props.modelValue,
  (area) => {
    name.value = area?.name ?? "";
  }
);

async function handleSubmit() {
  error.value = undefined;
  if (name.value.trim().length < 2) {
    error.value = "Bitte mindestens 2 Zeichen eingeben.";
    return;
  }
  const input = { hallId: props.hallId, name: name.value.trim() };
  if (props.modelValue?.id !== undefined) {
    await areaStore.update(props.modelValue.id, input);
  } else {
    await areaStore.create(input);
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
    <div class="flex justify-end gap-2">
      <FwbButton type="button" color="alternative" @click="emit('close')">Abbrechen</FwbButton>
      <FwbButton type="submit" color="default">Speichern</FwbButton>
    </div>
  </form>
</template>
