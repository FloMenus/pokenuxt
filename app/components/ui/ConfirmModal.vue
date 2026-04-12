<script setup lang="ts">
defineProps<{
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") emit("cancel");
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="emit('cancel')"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h2 class="text-lg font-bold text-gray-800">{{ title }}</h2>
          <p v-if="$slots.default || message" class="text-sm text-gray-500">
            <slot>{{ message }}</slot>
          </p>
        </div>

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            @click="emit('cancel')"
          >
            {{ cancelLabel ?? "Annuler" }}
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition"
            @click="emit('confirm')"
          >
            {{ confirmLabel ?? "Confirmer" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
