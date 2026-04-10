<script setup lang="ts">
import type { PokemonType } from "~/types/type";

const props = defineProps<{
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
}>();
</script>

<template>
  <NuxtLink
    :to="`/pokemon/${id}`"
    class="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-3 relative hover:shadow-md transition cursor-pointer"
  >
    <span class="absolute top-3 left-4 text-xs font-semibold text-gray-400">
      #{{ String(id).padStart(3, "0") }}
    </span>

    <UiFavoriteButton class="absolute top-2 right-3" @click.prevent />

    <img :src="image" :alt="name" class="w-28 h-28 object-contain mt-4" />

    <h3 class="text-base font-bold text-gray-800 capitalize">{{ name }}</h3>

    <div class="flex flex-wrap justify-center gap-1">
      <UiPokemonType v-for="t in types" :key="t" :type="t" />
    </div>
  </NuxtLink>
</template>
