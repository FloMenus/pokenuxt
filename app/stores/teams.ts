import { defineStore } from "pinia";
import type { Team, TeamPokemon } from "~/types/team";

export const useTeamsStore = defineStore(
  "teams",
  () => {
    const teams = ref<Team[]>([]);

    function createTeam(name = "Nouvelle équipe") {
      teams.value.push({ id: crypto.randomUUID(), name, pokemons: [] });
    }

    function deleteTeam(teamId: string) {
      teams.value = teams.value.filter((t) => t.id !== teamId);
    }

    function renameTeam(teamId: string, name: string) {
      const team = teams.value.find((t) => t.id === teamId);
      if (team) team.name = name;
    }

    function addPokemon(teamId: string, pokemon: TeamPokemon) {
      const team = teams.value.find((t) => t.id === teamId);
      if (!team || team.pokemons.length >= 6) return;
      if (team.pokemons.some((p) => p.id === pokemon.id)) return;
      team.pokemons.push(pokemon);
    }

    function removePokemon(teamId: string, pokemonId: number) {
      const team = teams.value.find((t) => t.id === teamId);
      if (team) team.pokemons = team.pokemons.filter((p) => p.id !== pokemonId);
    }

    function nicknamePokemon(
      teamId: string,
      pokemonId: number,
      nickname: string,
    ) {
      const team = teams.value.find((t) => t.id === teamId);
      const pokemon = team?.pokemons.find((p) => p.id === pokemonId);
      if (pokemon) pokemon.nickname = nickname || undefined;
    }

    function reorderTeam(teamId: string, pokemons: TeamPokemon[]) {
      const team = teams.value.find((t) => t.id === teamId);
      if (team) team.pokemons = pokemons;
    }

    return {
      teams,
      createTeam,
      deleteTeam,
      renameTeam,
      addPokemon,
      removePokemon,
      nicknamePokemon,
      reorderTeam,
    };
  },
  {
    persist: {
      key: "pokenuxt:teams",
    },
  },
);
