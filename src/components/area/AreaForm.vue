<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
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
    <Input v-model="name" label="Name" required :error="error" />
    <div class="flex justify-end gap-2">
      <Button type="button" variant="secondary" @click="emit('close')">Abbrechen</Button>
      <Button type="submit" variant="primary">Speichern</Button>
    </div>
  </form>
</template>
