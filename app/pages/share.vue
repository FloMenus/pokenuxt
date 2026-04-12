<script setup lang="ts">
import { pokemonService } from "~/services/pokemon";
import type { TeamPokemon } from "~/types/team";

definePageMeta({ layout: "main" });

const route = useRoute();
const t = route.query.t as string | undefined;

interface ShareData {
  name: string;
  pokemons: { id: number; nickname?: string }[];
}

let shareData: ShareData | null = null;
if (t) {
  try {
    shareData = JSON.parse(decodeURIComponent(escape(atob(t))));
  } catch {
    shareData = null;
  }
}

const { data: teamPokemons, pending } = await useAsyncData(
  "share-team",
  async () => {
    if (!shareData?.pokemons?.length) return [] as TeamPokemon[];
    const results = await Promise.allSettled(
      shareData.pokemons.map((p) => pokemonService.getById(String(p.id))),
    );
    return results
      .map((r, i): TeamPokemon | null => {
        if (r.status !== "fulfilled") return null;
        const p = r.value;
        return {
          id: p.id,
          name: p.name,
          nickname: shareData!.pokemons[i]?.nickname,
          image: p.image,
          types: p.types,
        };
      })
      .filter((p): p is TeamPokemon => p !== null);
  },
);

const slots = computed(() => {
  const filled = teamPokemons.value ?? [];
  return [
    ...filled,
    ...Array(Math.max(0, 6 - filled.length)).fill(undefined),
  ] as (TeamPokemon | undefined)[];
});

useSeoMeta({
  title: computed(() =>
    shareData ? `${shareData.name} — PokéNuxt` : "Équipe partagée — PokéNuxt",
  ),
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
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

    <div
      v-if="!shareData"
      class="flex flex-col items-center justify-center py-24 gap-3 text-gray-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p class="text-lg font-medium">Lien invalide</p>
      <p class="text-sm">Ce lien de partage est incorrect ou a expiré.</p>
    </div>

    <template v-else>
      <div class="mb-4 flex items-center gap-3">
        <div class="flex-1">
          <p
            class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5"
          >
            Équipe partagée
          </p>
          <h1 class="text-2xl font-bold text-gray-800">{{ shareData.name }}</h1>
        </div>
        <NuxtLink
          to="/teams"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 transition rounded-lg px-3 py-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Mes équipes
        </NuxtLink>
      </div>

      <div class="bg-white rounded-2xl shadow p-5">
        <div v-if="pending" class="grid grid-cols-6 gap-2">
          <div
            v-for="i in 6"
            :key="i"
            class="rounded-xl bg-gray-100 animate-pulse aspect-square min-h-24"
          />
        </div>
        <div v-else class="grid grid-cols-6 gap-2">
          <UiTeamPokemonSlot
            v-for="(pokemon, i) in slots"
            :key="i"
            :pokemon="pokemon"
            :index="i"
            readonly
          />
        </div>
      </div>
    </template>
  </div>
</template>
