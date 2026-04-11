<script setup lang="ts">
import type { PokemonAbility } from "~/types/pokemon";

defineProps<{
  abilities: PokemonAbility[];
}>();
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-gray-700 mb-3">Capacités spéciales</h2>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="ability in abilities"
        :key="ability.name"
        class="px-3 py-1 rounded-full text-sm font-medium capitalize"
        :class="
          ability.isHidden
            ? 'bg-gray-100 text-gray-400 border border-dashed border-gray-300'
            : 'bg-gray-100 text-gray-700'
        "
      >
        {{ ability.name.replace(/-/g, " ") }}
        <span v-if="ability.isHidden" class="text-xs ml-1">(cachée)</span>
      </span>
    </div>
  </div>
</template>
