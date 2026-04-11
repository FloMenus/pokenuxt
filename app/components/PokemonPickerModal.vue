<script setup lang="ts">
import { pokemonService } from "~/services/pokemon";
import type { Pokemon } from "~/types/pokemon";

const emit = defineEmits<{
  close: [];
  select: [pokemon: Pokemon];
}>();

const query = ref("");
const allNames = ref<string[]>([]);
const results = ref<Pokemon[]>([]);
const loading = ref(true);

let searchTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  allNames.value = await pokemonService.getNameList();
  results.value = await pokemonService.getByNames(allNames.value.slice(0, 12));
  loading.value = false;
});

watch(query, (q) => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => doSearch(q), 300);
});

async function doSearch(q: string) {
  loading.value = true;
  const trimmed = q.trim().toLowerCase();
  const names = trimmed
    ? allNames.value.filter((n) => n.includes(trimmed)).slice(0, 12)
    : allNames.value.slice(0, 12);
  results.value = await pokemonService.getByNames(names);
  loading.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<template>
  <div
    class="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden"
    >
      <div
        class="flex items-center gap-3 p-4 border-b border-gray-100 shrink-0"
      >
        <div
          class="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-400 shrink-0"
          >
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            v-model="query"
            type="text"
            placeholder="Rechercher un Pokémon..."
            class="flex-1 bg-transparent outline-none text-sm"
            autofocus
          />
          <button
            v-if="query"
            class="text-gray-400 hover:text-gray-600 transition text-xs"
            @click="query = ''"
          >
            ✕
          </button>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 transition shrink-0"
          @click="emit('close')"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div
            class="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
          />
        </div>

        <template v-else>
          <div v-if="results.length > 0" class="grid grid-cols-4 gap-2">
            <button
              v-for="pokemon in results"
              :key="pokemon.id"
              class="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-primary/10 hover:ring-1 hover:ring-primary transition text-left"
              @click="emit('select', pokemon)"
            >
              <img
                :src="pokemon.image"
                :alt="pokemon.name"
                class="w-14 h-14 object-contain"
              />
              <span class="text-xs text-gray-400">
                #{{ String(pokemon.id).padStart(3, "0") }}
              </span>
              <span
                class="text-xs font-semibold text-gray-700 capitalize text-center leading-tight"
              >
                {{ pokemon.name }}
              </span>
            </button>
          </div>

          <div v-else class="text-center py-12 text-gray-400 text-sm">
            Aucun résultat pour "{{ query }}"
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
