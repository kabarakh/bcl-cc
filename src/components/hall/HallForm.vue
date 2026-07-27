<script setup lang="ts">
import { ref, watch } from "vue";
import { FwbButton, FwbInput } from "flowbite-vue";
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
    <FwbInput
      v-model="name"
      label="Name"
      required
      :validation-status="errors.name ? 'error' : undefined"
    >
      <template v-if="errors.name" #validationMessage>{{ errors.name }}</template>
    </FwbInput>
    <FwbInput
      v-model="address"
      label="Adresse"
      required
      :validation-status="errors.address ? 'error' : undefined"
    >
      <template v-if="errors.address" #validationMessage>{{ errors.address }}</template>
    </FwbInput>
    <FwbInput v-model="image" label="Bild-URL (optional)" />
    <div class="flex justify-end gap-2">
      <FwbButton type="button" color="alternative" @click="emit('close')">Abbrechen</FwbButton>
      <FwbButton type="submit" color="default">Speichern</FwbButton>
    </div>
  </form>
</template>
