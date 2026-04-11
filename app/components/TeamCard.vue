<script setup lang="ts">
import type { Team } from "~/types/team";
import type { Pokemon } from "~/types/pokemon";
import { useTeamsStore } from "~/stores/teams";

const props = defineProps<{ team: Team }>();

const store = useTeamsStore();

const isEditing = ref(false);
const nameInput = ref(props.team.name);
const pickerOpen = ref(false);
const copied = ref(false);
const confirmDelete = ref(false);

function shareTeam() {
  const data = {
    name: props.team.name,
    pokemons: props.team.pokemons.map(({ id, nickname }) =>
      nickname ? { id, nickname } : { id },
    ),
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const url = `${window.location.origin}/share?t=${encoded}`;
  navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function startEdit() {
  nameInput.value = props.team.name;
  isEditing.value = true;
}

function confirmRename() {
  const trimmed = nameInput.value.trim();
  if (trimmed) store.renameTeam(props.team.id, trimmed);
  isEditing.value = false;
}

function onSelect(pokemon: Pokemon) {
  store.addPokemon(props.team.id, pokemon);
  pickerOpen.value = false;
}

const slots = computed(() => {
  const filled = props.team.pokemons;
  const empties = new Array(Math.max(0, 6 - filled.length)).fill(undefined);
  return [...filled, ...empties] as ((typeof filled)[number] | undefined)[];
});

const canAddMore = computed(() => props.team.pokemons.length < 6);

const dragFrom = ref<number | null>(null);
const dragOver = ref<number | null>(null);

function onDragStart(index: number) {
  dragFrom.value = index;
}

function onDragEnter(index: number) {
  dragOver.value = index;
}

function onDrop(index: number) {
  if (dragFrom.value !== null && dragFrom.value !== index) {
    const six: ((typeof props.team.pokemons)[number] | null)[] = Array.from(
      { length: 6 },
      (_, i) => props.team.pokemons[i] ?? null,
    );
    const tmp = six[dragFrom.value] ?? null;
    six[dragFrom.value] = six[index] ?? null;
    six[index] = tmp;
    store.reorderTeam(
      props.team.id,
      six.filter((p): p is NonNullable<typeof p> => p !== null),
    );
  }
  dragFrom.value = null;
  dragOver.value = null;
}

function onDragEnd() {
  dragFrom.value = null;
  dragOver.value = null;
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4 w-full">
    <div class="flex items-center gap-2">
      <template v-if="isEditing">
        <input
          v-model="nameInput"
          class="flex-1 text-lg font-bold text-gray-800 border-b-2 border-primary outline-none bg-transparent min-w-0"
          autofocus
          @keyup.enter="confirmRename"
          @keyup.escape="isEditing = false"
          @blur="confirmRename"
        />
      </template>
      <template v-else>
        <h3 class="flex-1 text-lg font-bold text-gray-800 truncate min-w-0">
          {{ team.name }}
        </h3>
      </template>

      <UiBadge variant="outline" color="secondary" class="shrink-0 text-xs">
        {{ team.pokemons.length }}/6
      </UiBadge>

      <button
        class="transition shrink-0"
        :class="copied ? 'text-green-500' : 'text-gray-300 hover:text-blue-400'"
        :title="copied ? 'Lien copié !' : 'Partager'"
        @click="shareTeam"
      >
        <svg
          v-if="copied"
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      <button
        v-if="!isEditing"
        class="text-gray-300 hover:text-gray-600 transition shrink-0"
        title="Renommer"
        @click="startEdit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
      </button>

      <button
        class="text-gray-300 hover:text-red-400 transition shrink-0"
        title="Supprimer l'équipe"
        @click="confirmDelete = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-6 gap-2">
      <UiTeamPokemonSlot
        v-for="(pokemon, i) in slots"
        :key="i"
        :pokemon="pokemon"
        :index="i"
        :is-drag-target="dragOver === i && dragFrom !== null && dragFrom !== i"
        @remove="pokemon && store.removePokemon(team.id, pokemon.id)"
        @add="canAddMore && (pickerOpen = true)"
        @nickname="
          (value) =>
            pokemon && store.nicknamePokemon(team.id, pokemon.id, value)
        "
        @move-start="onDragStart"
        @move-enter="onDragEnter"
        @move-drop="onDrop"
        @move-end="onDragEnd"
      />
    </div>

    <Teleport to="body">
      <PokemonPickerModal
        v-if="pickerOpen"
        @close="pickerOpen = false"
        @select="onSelect"
      />
      <UiConfirmModal
        v-if="confirmDelete"
        title="Supprimer l'équipe"
        confirm-label="Supprimer"
        @confirm="store.deleteTeam(team.id)"
        @cancel="confirmDelete = false"
      >
        Voulez-vous vraiment supprimer <span class="font-bold text-gray-700">{{ team.name }}</span> ? Cette action est irréversible.
      </UiConfirmModal>
    </Teleport>
  </div>
</template>
