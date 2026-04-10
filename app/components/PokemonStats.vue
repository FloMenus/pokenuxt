<script setup lang="ts">
import type { PokemonStat } from "~/types/pokemon";

defineProps<{
  stats: PokemonStat[];
}>();

const statLabels: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Attaque Spé.",
  "special-defense": "Défense Spé.",
  speed: "Vitesse",
};

const STAT_MAX = 255;

function statPercent(value: number) {
  return Math.round((value / STAT_MAX) * 100);
}

function statColor(value: number) {
  if (value < 50) return "bg-red-400";
  if (value < 80) return "bg-yellow-400";
  return "bg-green-400";
}
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-gray-700 mb-4">Statistiques de base</h2>
    <div class="flex flex-col gap-3">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="flex items-center gap-3"
      >
        <span class="text-sm text-gray-500 w-28 shrink-0 text-right">
          {{ statLabels[stat.name] ?? stat.name }}
        </span>
        <span
          class="text-sm font-semibold text-gray-800 w-8 shrink-0 text-right"
        >
          {{ stat.value }}
        </span>
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="statColor(stat.value)"
            :style="{ width: `${statPercent(stat.value)}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
