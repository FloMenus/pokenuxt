<script setup lang="ts">
import { useTeamsStore } from "~/stores/teams";

definePageMeta({ layout: "main" });

useSeoMeta({
  title: "Mes Équipes — PokéNuxt",
  description: "Créez et gérez vos équipes Pokémon.",
});

const store = useTeamsStore();
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Mes Équipes</h1>
      <UiButton @click="store.createTeam()">
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nouvelle équipe
      </UiButton>
    </div>

    <ClientOnly>
      <div
        v-if="store.teams.length === 0"
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p class="text-lg font-medium">Aucune équipe</p>
        <p class="text-sm">Créez votre première équipe pour commencer !</p>
      </div>

      <div v-else class="flex flex-col gap-4">
        <TeamCard v-for="team in store.teams" :key="team.id" :team="team" />
      </div>

      <template #fallback>
        <div class="flex flex-col gap-4">
          <div
            v-for="i in 2"
            :key="i"
            class="bg-white rounded-2xl shadow p-5 w-full h-40 animate-pulse"
          />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
