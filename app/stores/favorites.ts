import { defineStore } from "pinia";
import type { Pokemon } from "~/types/pokemon";

export const useFavoritesStore = defineStore(
  "favorites",
  () => {
    const favorites = ref<Pokemon[]>([]);

    function isFavorite(id: number): boolean {
      return favorites.value.some((p) => p.id === id);
    }

    function toggle(pokemon: Pokemon) {
      if (isFavorite(pokemon.id)) {
        favorites.value = favorites.value.filter((p) => p.id !== pokemon.id);
      } else {
        favorites.value = [...favorites.value, pokemon];
      }
    }

    return { favorites, isFavorite, toggle };
  },
  {
    persist: {
      key: "pokenuxt:favorites",
    },
  },
);
