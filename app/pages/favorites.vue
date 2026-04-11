<script setup lang="ts">
import { useFavoritesStore } from "~/stores/favorites";

definePageMeta({
    layout: "main",
});

useSeoMeta({
    title: "Favoris",
    description: "Retrouvez vos Pokémon favoris sur PokéNuxt !",
});

const favoritesStore = useFavoritesStore();
</script>

<template>
    <div class="mt-6 max-w-4xl mx-auto flex flex-col justify-center items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <h1 class="text-3xl font-bold mb-4">Mes Pokémon Favoris</h1>
        <p class="text-gray-600 mb-6">Retrouvez tous les Pokémon que vous avez ajoutés à vos favoris.</p>
    </div>

    <div class="mt-8 max-w-7xl mx-auto">
        <div v-if="favoritesStore.favorites.length === 0"
            class="flex flex-col items-center justify-center py-24 text-gray-400">
            <p class="text-lg">Aucun Pokémon favori pour le moment.</p>
        </div>

        <div v-else class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
            <PokemonCard v-for="pokemon in favoritesStore.favorites" :key="pokemon.id" :id="pokemon.id"
                :name="pokemon.name" :image="pokemon.image" :types="pokemon.types" />
        </div>
    </div>
</template>
