import type { PokemonType } from "./type";

export interface TeamPokemon {
  id: number;
  name: string;
  nickname?: string;
  image: string;
  types: PokemonType[];
}

export interface Team {
  id: string;
  name: string;
  pokemons: TeamPokemon[];
}
