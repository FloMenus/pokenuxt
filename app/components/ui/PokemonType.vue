<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-0.5 text-sm font-semibold rounded-full text-white',
      colorClass,
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { PokemonType } from "~/types/type";

const props = defineProps<{
  type: PokemonType;
}>();

const colorMap: Record<PokemonType, string> = {
  normal: "bg-pokemon-normal",
  fire: "bg-pokemon-fire",
  water: "bg-pokemon-water",
  grass: "bg-pokemon-grass",
  electric: "bg-pokemon-electric",
  ice: "bg-pokemon-ice",
  fighting: "bg-pokemon-fighting",
  poison: "bg-pokemon-poison",
  ground: "bg-pokemon-ground",
  flying: "bg-pokemon-flying",
  psychic: "bg-pokemon-psychic",
  bug: "bg-pokemon-bug",
  rock: "bg-pokemon-rock",
  ghost: "bg-pokemon-ghost",
  dragon: "bg-pokemon-dragon",
  dark: "bg-pokemon-dark",
  steel: "bg-pokemon-steel",
  fairy: "bg-pokemon-fairy",
  unknown: "bg-pokemon-unknown",
  stellar: "bg-pokemon-stellar",
};

const labelMap: Record<PokemonType, string> = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  grass: "Plante",
  electric: "Électrik",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée",
  unknown: "Inconnu",
  stellar: "Stellar",
};

const colorClass = computed(() => colorMap[props.type]);
const label = computed(() => labelMap[props.type]);
</script>
