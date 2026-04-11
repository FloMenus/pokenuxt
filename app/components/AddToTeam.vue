<script setup lang="ts">
import type { TeamPokemon } from "~/types/team";
import { useTeamsStore } from "~/stores/teams";

const props = defineProps<{ pokemon: TeamPokemon }>();

const store = useTeamsStore();
const open = ref(false);

const availableTeams = computed(() =>
  store.teams.filter(
    (t) =>
      t.pokemons.length < 6 &&
      !t.pokemons.some((p) => p.id === props.pokemon.id),
  ),
);

const fullTeams = computed(() =>
  store.teams.filter(
    (t) =>
      t.pokemons.length >= 6 &&
      !t.pokemons.some((p) => p.id === props.pokemon.id),
  ),
);

const alreadyIn = computed(() =>
  store.teams.filter((t) => t.pokemons.some((p) => p.id === props.pokemon.id)),
);

function add(teamId: string) {
  store.addPokemon(teamId, props.pokemon);
  open.value = false;
}
</script>

<template>
  <div class="relative">
    <UiButton
      color="secondary"
      variant="outline"
      class="w-full"
      @click="open = !open"
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
      Ajouter à une équipe
      <span
        v-if="alreadyIn.length > 0"
        class="ml-auto flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 leading-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {{ alreadyIn.length }}
      </span>
    </UiButton>

    <div v-if="open" class="fixed inset-0 z-[5]" @click="open = false" />

    <div
      v-if="open"
      class="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden"
    >
      <div
        v-if="store.teams.length === 0"
        class="px-4 py-3 text-sm text-gray-500 text-center"
      >
        Aucune équipe —
        <NuxtLink
          to="/teams"
          class="text-primary hover:underline"
          @click="open = false"
        >
          Créer une équipe
        </NuxtLink>
      </div>

      <template v-else>
        <button
          v-for="team in availableTeams"
          :key="team.id"
          class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition text-sm text-left"
          @click="add(team.id)"
        >
          <span class="font-medium text-gray-700">{{ team.name }}</span>
          <span class="text-xs text-gray-400"
            >{{ team.pokemons.length }}/6</span
          >
        </button>

        <div
          v-for="team in alreadyIn"
          :key="team.id"
          class="flex items-center justify-between px-4 py-2.5 text-sm"
        >
          <span class="text-gray-400">{{ team.name }}</span>
          <span class="text-xs text-green-500 font-medium"
            >✓ Dans l'équipe</span
          >
        </div>

        <div
          v-for="team in fullTeams"
          :key="team.id"
          class="flex items-center justify-between px-4 py-2.5 text-sm opacity-40"
        >
          <span class="text-gray-500">{{ team.name }}</span>
          <span class="text-xs text-gray-400">Équipe complète</span>
        </div>
      </template>
    </div>
  </div>
</template>
