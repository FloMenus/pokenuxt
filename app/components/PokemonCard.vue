<script setup lang="ts">
import type { PokemonType } from "~/types/type";
import { useFavoritesStore } from "~/stores/favorites";

const props = defineProps<{
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
}>();

const favoritesStore = useFavoritesStore();

const isFav = computed(() => favoritesStore.isFavorite(props.id));

function toggleFavorite() {
  favoritesStore.toggle({
    id: props.id,
    name: props.name,
    image: props.image,
    types: props.types,
  });
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-3 relative"
  >
    <span class="absolute top-3 left-4 text-xs font-semibold text-gray-400">
      #{{ String(id).padStart(3, "0") }}
    </span>

    <button class="absolute top-2 right-3 transition cursor-pointer" @click="toggleFavorite">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        :class="isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-300'"
        viewBox="0 0 24 24"
        :fill="isFav ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    </button>

    <img :src="image" :alt="name" class="w-28 h-28 object-contain mt-4" />

    <h3 class="text-base font-bold text-gray-800 capitalize">{{ name }}</h3>

    <div class="flex flex-wrap justify-center gap-1">
      <UiPokemonType v-for="t in types" :key="t" :type="t" />
    </div>
  </div>
</template>
