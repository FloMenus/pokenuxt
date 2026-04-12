<script setup lang="ts">
import { type PokemonType } from "~/types/type";

const emit = defineEmits<{
  search: [options: { generation: number[]; types: PokemonType[] }];
}>();

const pokemonTypes: PokemonType[] = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
    'unknown', 'stellar'
  ]

const generations: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const selectedGenerations = ref<number[]>([]);
const selectedTypes = ref<PokemonType[]>([]);

function toggleGeneration(gen: number) {
  const idx = selectedGenerations.value.indexOf(gen);
  if (idx === -1) selectedGenerations.value.push(gen);
  else selectedGenerations.value.splice(idx, 1);
}

function toggleType(type: PokemonType) {
  const idx = selectedTypes.value.indexOf(type);
  if (idx === -1) selectedTypes.value.push(type);
  else selectedTypes.value.splice(idx, 1);
}

function reset() {
  selectedGenerations.value = [];
  selectedTypes.value = [];
  emit("search", { generation: [], types: [] });
}

function search() {
  emit("search", {
    generation: [...selectedGenerations.value],
    types: [...selectedTypes.value],
  });
}
</script>

<template>
  <div class="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col gap-5">

    <!-- Générations -->
    <div>
      <p class="text-sm font-semibold text-gray-900 mb-2">Génération</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="gen in generations"
          :key="gen"
          @click="toggleGeneration(gen)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium border transition-colors',
            selectedGenerations.includes(gen)
              ? 'bg-primary text-white border-primary'
              : 'bg-transparent text-gray-600 border-gray-300 hover:border-primary hover:text-primary',
          ]"
        >
          Gen {{ gen }}
        </button>
      </div>
    </div>

    <!-- Types -->
    <div>
      <p class="text-sm font-semibold text-gray-600 mb-2">Type</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in pokemonTypes"
          :key="type"
          @click="toggleType(type)"
          class="rounded-full transition-all"
        >
          <UiPokemonType :type="type" :selected="selectedTypes.includes(type)" />
        </button>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <UiButton color="secondary" variant="ghost" @click="reset">
        Réinitialiser
      </UiButton>
      <UiButton @click="search">
        Rechercher
      </UiButton>
    </div>
  </div>
</template>