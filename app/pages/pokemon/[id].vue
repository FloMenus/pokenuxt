<script setup lang="ts">
import { pokemonService } from "~/services/pokemon";

definePageMeta({
  layout: "main",
});

const route = useRoute();
const id = route.params.id as string;

const { data: pokemon, pending } = await useAsyncData(`pokemon-${id}`, () =>
  pokemonService.getById(id),
);

const { data: evolutionChain, pending: evolutionPending } = useAsyncData(
  `pokemon-evolution-${id}`,
  () => pokemonService.getEvolutionChain(id),
);

const { data: forms } = useAsyncData(
  `pokemon-forms-${id}`,
  () => pokemonService.getForms(id),
  { default: () => [] as any },
);

useSeoMeta({
  title: computed(() =>
    pokemon.value
      ? `${pokemon.value.name.charAt(0).toUpperCase() + pokemon.value.name.slice(1)} — PokéNuxt`
      : "Pokémon",
  ),
});
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition mb-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      Retour au Pokédex
    </NuxtLink>

    <div v-if="pending" class="flex justify-center items-center py-24">
      <div
        class="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
      />
    </div>

    <template v-else-if="pokemon">
      <div class="bg-white rounded-2xl shadow p-6 flex flex-col gap-8 relative">
        <UiFavoriteButton size="lg" class="absolute top-4 right-4" />

        <div class="flex flex-col items-center gap-3">
          <span class="text-sm font-semibold text-gray-400 self-start">
            #{{ String(pokemon.id).padStart(3, "0") }}
          </span>
          <img
            :src="pokemon.image"
            :alt="pokemon.name"
            class="w-48 h-48 object-contain"
          />
          <h1 class="text-3xl font-bold text-gray-800 capitalize">
            {{ pokemon.name }}
          </h1>
          <div class="flex flex-wrap justify-center gap-2">
            <UiPokemonType v-for="t in pokemon.types" :key="t" :type="t" />
          </div>
        </div>

        <p v-if="pokemon.description" class="text-gray-600 text-center italic">
          {{ pokemon.description }}
        </p>

        <UiPokemonPhysicalInfo
          :height="pokemon.height"
          :weight="pokemon.weight"
        />
        <PokemonStats :stats="pokemon.stats" />
        <PokemonAbilities :abilities="pokemon.abilities" />
        <PokemonForms v-if="forms && forms.length > 0" :forms="forms" />

        <div v-if="evolutionPending" class="flex justify-center py-4">
          <div
            class="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
          />
        </div>
        <PokemonEvolutions
          v-else-if="evolutionChain"
          :chain="evolutionChain"
          :current-id="pokemon.id"
        />
      </div>
    </template>
  </div>
</template>
