<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import { useHallStore } from "@/stores/hallStore";
import type { Hall } from "@/types/Hall";

const props = defineProps<{
  modelValue?: Hall;
}>();

const emit = defineEmits<{
  close: [];
}>();

const hallStore = useHallStore();

const name = ref(props.modelValue?.name ?? "");
const address = ref(props.modelValue?.address ?? "");
const image = ref(props.modelValue?.image ?? "");
const errors = ref<{ name?: string; address?: string }>({});

watch(
  () => props.modelValue,
  (hall) => {
    name.value = hall?.name ?? "";
    address.value = hall?.address ?? "";
    image.value = hall?.image ?? "";
  }
);

function validate(): boolean {
  errors.value = {};
  if (name.value.trim().length < 2) {
    errors.value.name = "Bitte mindestens 2 Zeichen eingeben.";
  }
  if (address.value.trim().length < 2) {
    errors.value.address = "Bitte mindestens 2 Zeichen eingeben.";
  }
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  const input = {
    name: name.value.trim(),
    address: address.value.trim(),
    image: image.value.trim() || undefined
  };
  if (props.modelValue?.id !== undefined) {
    await hallStore.update(props.modelValue.id, input);
  } else {
    await hallStore.create(input);
  }
  emit("close");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <Input v-model="name" label="Name" required :error="errors.name" />
    <Input v-model="address" label="Adresse" required :error="errors.address" />
    <Input v-model="image" label="Bild-URL (optional)" />
    <div class="flex justify-end gap-2">
      <Button type="button" variant="secondary" @click="emit('close')">Abbrechen</Button>
      <Button type="submit" variant="primary">Speichern</Button>
    </div>
  </form>
</template>
