<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-0.5 text-sm font-semibold rounded-full border',
      selected ? [colorClass, 'text-white border-transparent'] : ['bg-white', textClass, borderClass],
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { PokemonType } from "~/types/type";

const props = withDefaults(defineProps<{
  type: PokemonType;
  selected?: boolean;
}>(), {
  selected: true,
});

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

const textColorMap: Record<PokemonType, string> = {
  normal: "text-pokemon-normal",
  fire: "text-pokemon-fire",
  water: "text-pokemon-water",
  grass: "text-pokemon-grass",
  electric: "text-pokemon-electric",
  ice: "text-pokemon-ice",
  fighting: "text-pokemon-fighting",
  poison: "text-pokemon-poison",
  ground: "text-pokemon-ground",
  flying: "text-pokemon-flying",
  psychic: "text-pokemon-psychic",
  bug: "text-pokemon-bug",
  rock: "text-pokemon-rock",
  ghost: "text-pokemon-ghost",
  dragon: "text-pokemon-dragon",
  dark: "text-pokemon-dark",
  steel: "text-pokemon-steel",
  fairy: "text-pokemon-fairy",
  unknown: "text-pokemon-unknown",
  stellar: "text-pokemon-stellar",
};

const borderColorMap: Record<PokemonType, string> = {
  normal: "border-pokemon-normal",
  fire: "border-pokemon-fire",
  water: "border-pokemon-water",
  grass: "border-pokemon-grass",
  electric: "border-pokemon-electric",
  ice: "border-pokemon-ice",
  fighting: "border-pokemon-fighting",
  poison: "border-pokemon-poison",
  ground: "border-pokemon-ground",
  flying: "border-pokemon-flying",
  psychic: "border-pokemon-psychic",
  bug: "border-pokemon-bug",
  rock: "border-pokemon-rock",
  ghost: "border-pokemon-ghost",
  dragon: "border-pokemon-dragon",
  dark: "border-pokemon-dark",
  steel: "border-pokemon-steel",
  fairy: "border-pokemon-fairy",
  unknown: "border-pokemon-unknown",
  stellar: "border-pokemon-stellar",
};

const colorClass = computed(() => colorMap[props.type]);
const textClass = computed(() => textColorMap[props.type]);
const borderClass = computed(() => borderColorMap[props.type]);
const label = computed(() => labelMap[props.type]);
</script>
