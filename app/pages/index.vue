<script setup lang="ts">
import { pokemonService } from "~/services/pokemon";
import type { GetAllPokemonOptions } from "~/types/pokemon";
import type { PokemonType } from "~/types/type";

definePageMeta({
  layout: "main",
});

useSeoMeta({
  title: "Accueil",
  description:
    "Découvrez, capturez et collectionnez vos Pokémon préférés avec PokéNuxt !",
});

const LIMIT = 60;
const page = ref(1);
const showAdvanced = ref(false);
const advancedOptions = ref<GetAllPokemonOptions>({});

const { data, pending } = await useAsyncData(
  "pokemons",
  () => pokemonService.getAllWithOptions(page.value, advancedOptions.value),
  { watch: [page, advancedOptions] },
);

const pokemons = computed(() => data.value?.pokemons ?? []);
const total = computed(() => data.value?.total ?? 0);

function onPageChange(p: number) {
  page.value = p;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function onAdvancedSearch(options: { generation: number[]; types: PokemonType[] }) {
  advancedOptions.value = options;
  page.value = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const hasActiveFilters = computed(
  () =>
    (advancedOptions.value.generation?.length ?? 0) > 0 ||
    (advancedOptions.value.types?.length ?? 0) > 0,
);
</script>

<template>
  <div
    class="mt-6 max-w-4xl mx-auto flex flex-col justify-center items-center gap-2"
  >
    <SearchBar class="w-full" />
    <UiButton
      color="secondary"
      variant="ghost"
      :class="{ 'text-primary': showAdvanced || hasActiveFilters }"
      @click="showAdvanced = !showAdvanced"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"
      >
        <path d="M10 5H3" />
        <path d="M12 19H3" />
        <path d="M14 3v4" />
        <path d="M16 17v4" />
        <path d="M21 12h-9" />
        <path d="M21 19h-5" />
        <path d="M21 5h-7" />
        <path d="M8 10v4" />
        <path d="M8 12H3" />
      </svg>
      Recherche avancée
      <span
        v-if="hasActiveFilters"
        class="ml-1 w-2 h-2 rounded-full bg-primary inline-block"
      />
    </UiButton>

    <AdvancedResearchMenu
      v-if="showAdvanced"
      class="w-full"
      @search="onAdvancedSearch"
    />
  </div>

  <div class="mt-8 max-w-7xl mx-auto">
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div
        class="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
      />
    </div>

    <template v-else>
      <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
        <PokemonCard
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          :id="pokemon.id"
          :name="pokemon.name"
          :image="pokemon.image"
          :types="pokemon.types"
        />
      </div>

      <div class="mt-8 pb-8">
        <UiPagination
          :page="page"
          :total="total"
          :per-page="LIMIT"
          @change="onPageChange"
        />
      </div>
    </template>
  </div>
</template>