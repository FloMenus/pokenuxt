<script setup lang="ts">
import type { TeamPokemon } from "~/types/team";

const props = defineProps<{
  pokemon?: TeamPokemon;
  index?: number;
  isDragTarget?: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  remove: [];
  add: [];
  nickname: [value: string];
  "move-start": [index: number];
  "move-enter": [index: number];
  "move-drop": [index: number];
  "move-end": [];
}>();

const isEditing = ref(false);
const nicknameInput = ref("");

function startEdit() {
  nicknameInput.value = props.pokemon?.nickname ?? props.pokemon?.name ?? "";
  isEditing.value = true;
}

function confirmEdit() {
  emit("nickname", nicknameInput.value.trim());
  isEditing.value = false;
}

const displayName = computed(
  () => props.pokemon?.nickname || props.pokemon?.name || "",
);

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  if (props.index !== undefined) emit("move-start", props.index);
}

function onDragEnter(e: DragEvent) {
  e.preventDefault();
  if (props.index !== undefined) emit("move-enter", props.index);
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  if (props.index !== undefined) emit("move-drop", props.index);
}
</script>

<template>
  <div
    v-if="pokemon"
    class="relative flex flex-col items-center justify-center rounded-xl border-2 bg-gray-50 transition-all p-1 aspect-square min-h-24 group select-none"
    :class="[
      isDragTarget
        ? 'border-primary bg-primary/5 scale-105 shadow-md'
        : 'border-gray-100',
      readonly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
    ]"
    :draggable="!readonly"
    @dragstart.stop="!readonly && onDragStart($event)"
    @dragenter="!readonly && onDragEnter($event)"
    @dragover.prevent
    @drop="!readonly && onDrop($event)"
    @dragend="!readonly && emit('move-end')"
  >
    <button
      v-if="!readonly"
      class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-400 transition text-sm leading-none opacity-0 group-hover:opacity-100"
      title="Retirer"
      draggable="false"
      @click="emit('remove')"
      @dragstart.stop
    >
      ✕
    </button>

    <button
      v-if="!readonly"
      class="absolute top-1 left-1 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-100 hover:text-blue-500 text-gray-400 transition opacity-0 group-hover:opacity-100"
      title="Surnom"
      draggable="false"
      @click.stop="startEdit"
      @dragstart.stop
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
    </button>

    <NuxtLink
      :to="`/pokemon/${pokemon.id}`"
      class="flex flex-col items-center gap-0.5"
      draggable="false"
    >
      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="w-16 h-16 object-contain"
        draggable="false"
      />
    </NuxtLink>

    <input
      v-if="isEditing"
      v-model="nicknameInput"
      class="w-full text-xs text-center font-medium text-gray-700 bg-white border border-primary rounded px-0.5 outline-none mt-0.5"
      autofocus
      @keyup.enter="confirmEdit"
      @keyup.escape="isEditing = false"
      @blur="confirmEdit"
      @click.stop
    />
    <span
      v-else
      class="text-sm font-medium capitalize text-center leading-tight w-full truncate px-1 mt-0.5"
      :class="pokemon.nickname ? 'text-primary' : 'text-gray-700'"
    >
      {{ displayName }}
    </span>
  </div>

  <button
    v-else-if="!readonly"
    class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all aspect-square min-h-24 cursor-pointer"
    :class="
      isDragTarget
        ? 'border-primary bg-primary/5 text-primary scale-105'
        : 'border-gray-200 hover:border-primary hover:bg-primary/5 hover:text-primary text-gray-200'
    "
    @click="emit('add')"
    @dragenter="onDragEnter"
    @dragover.prevent
    @drop="onDrop"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </button>

  <div
    v-else
    class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-100 aspect-square min-h-24 bg-gray-50/50"
  />
</template>
